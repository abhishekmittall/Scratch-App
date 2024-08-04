import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { styles } from './styles'
import { Header } from '../../components/common';
import { ImagePath } from '../../utils/helper/constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withTiming,
    withSpring,
    Easing,
    cancelAnimation
} from 'react-native-reanimated';

export const Main: React.FC = ({ navigation }: any) => {
    const defaultSprit1 = { id: 1, uri: ImagePath.catSprite, spritName: 'Cat', actions: [] }
    const defaultSprit2 = { id: 2, uri: ImagePath.ballSprite, spritName: 'Ball', actions: [] }
    const defaultSprit3 = { id: 3, uri: ImagePath.robotSprite, spritName: 'Robot', actions: [] }
    const [spritData, setSpritData] = useState<any[]>([defaultSprit1, defaultSprit2, defaultSprit3]);
    const [selectedSprit, setSelectedSprit] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);
    const [dragging, setDragging] = useState<boolean>(false);

    const [text, setText] = useState(spritData.map(() => ''));
    const updateTextForImage = (index: number, text: any) => {
        setText(prevTexts => {
            const newTexts = [...prevTexts];
            newTexts[index] = text;
            return newTexts;
        });
    };

    const defaultCoordinates = { x: 0, y: 0 };
    const [coordinates, setCoordinates] = useState<any>(defaultCoordinates);
    const sharedValues = spritData?.map(() => ({
        translateX: useSharedValue(defaultCoordinates.x),
        translateY: useSharedValue(defaultCoordinates.y),
        rotation: useSharedValue(0),
        scale: useSharedValue(1),
    }));

    useFocusEffect(
        useCallback(() => {
            const fetchActions = async () => {
                const storedActions = await AsyncStorage.getItem('droppedItems');
                if (storedActions) {
                    setSpritData(JSON.parse(storedActions));
                }
            };
            fetchActions();
        }, [])
    );

    const runActions = () => {
        if (playing) {
            setPlaying(false);
            sharedValues?.forEach(value => {
                cancelAnimation(value.translateX);
                cancelAnimation(value.translateY);
                cancelAnimation(value.rotation);
                cancelAnimation(value.scale);
            });
            return;
        }

        setPlaying(true);
        spritData?.forEach((image, index) => {
            const { translateX, translateY, rotation, scale } = sharedValues[index];

            image?.actions?.forEach((action: any) => {
                switch (action?.type) {
                    case 'moveX':
                        translateX.value = withTiming(translateX.value + action.value, { duration: 500 }, () => { });
                        break;
                    case 'moveY':
                        translateY.value = withTiming(translateY.value + action.value, { duration: 500 }, () => { });
                        break;
                    case 'rotate':
                        rotation.value = withTiming(rotation.value + action.value, { duration: 500 }, () => { });
                        break;
                    case 'goTo':
                        translateX.value = withTiming(action.value.x, { duration: 500, easing: Easing.linear }, () => { });
                        translateY.value = withTiming(action.value.y, { duration: 500, easing: Easing.linear }, () => { });
                        setCoordinates({ x: action.value.x, y: action.value.y });
                        break;
                    case 'moveXY':
                        translateX.value = withTiming(translateX.value + action.x, { duration: 500 });
                        translateY.value = withTiming(translateY.value + action.y, { duration: 500 }, () => { });
                        break;
                    case 'random':
                        const randomX = Math.random() * 300;
                        const randomY = Math.random() * 300;
                        translateX.value = withTiming(randomX, { duration: 500 });
                        translateY.value = withTiming(randomY, { duration: 500 });
                        setCoordinates({ x: randomX, y: randomY });
                        break;
                    case 'sayHello':
                        console.log('call', index);

                        updateTextForImage(index, 'Hello');
                        break;
                    case 'sayHelloFor1Sec':
                        console.log('called', index);
                        updateTextForImage(index, 'Hello');
                        setTimeout(() => {
                            updateTextForImage(index, '');
                        }, 1000);
                        break;
                    case 'increaseSize':
                        scale.value = withTiming(scale.value + 0.5, { duration: 500 }, () => { });
                        break;
                    case 'decreaseSize':
                        scale.value = withTiming(Math.max(0.5, scale.value - 0.1), { duration: 500 }, () => { });
                        break;
                }
            });
        });
    };

    const handleReset = () => {
        spritData?.forEach((_, index) => {
            const { translateX, translateY, rotation, scale } = sharedValues[index];
            translateX.value = withSpring(defaultCoordinates.x);
            translateY.value = withSpring(defaultCoordinates.y);
            rotation.value = 0;
            setCoordinates(defaultCoordinates);
            scale.value = 1;
        })
        setText(spritData.map(() => ''));
    };

    useFocusEffect(
        React.useCallback(() => {
            handleReset();
        }, [])
    );

    const animatedStyle = spritData?.map((_, index) => useAnimatedStyle(() => ({
        transform: [
            { translateX: sharedValues[index].translateX.value },
            { translateY: sharedValues[index].translateY.value },
            { rotate: `${sharedValues[index].rotation.value}deg` },
            { scale: sharedValues[index].scale.value },
        ],
    })));

    const panGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { startX: number; startY: number }
    >({
        onStart: (_, ctx) => {
            ctx.startX = sharedValues[selectedSprit].translateX.value;
            ctx.startY = sharedValues[selectedSprit].translateY.value;
            runOnJS(setDragging)(true);
        },
        onActive: (event, ctx) => {
            sharedValues[selectedSprit].translateX.value = ctx.startX + event.translationX;
            sharedValues[selectedSprit].translateY.value = ctx.startY + event.translationY;
            runOnJS(setCoordinates)({ x: sharedValues[selectedSprit].translateX.value, y: sharedValues[selectedSprit].translateY.value });
        },
        onEnd: () => {
            sharedValues[selectedSprit].translateX.value = sharedValues[selectedSprit].translateX.value;
            sharedValues[selectedSprit].translateY.value = sharedValues[selectedSprit].translateY.value;
            runOnJS(setDragging)(false);
        },
    });

    const clearAsyncStorage = async () => {
        await AsyncStorage.clear();
    };

    useEffect(() => {
        clearAsyncStorage();
    }, []);

    const pickImage = async () => {
        await ImagePicker.openPicker({
            width: 48,
            height: 48,
            cropping: true
        }).then(image => {
            const newItem: any = {
                id: image.path.split('/').pop() || Math.random().toString(),
                uri: { uri: image.path },
                spritName: `Item ${spritData?.length + 1}`,
                actions: [{
                    id: 4,
                    description: 'Go to random position',
                    type: 'random'
                }]
            };

            const updatedData: any[] = [...spritData, newItem];
            console.log(' image: ', updatedData);
            setSpritData(updatedData);
            saveDataToStorage(updatedData);
        }).catch(error => {
            console.log('Error picking image: ', error);
        });
    };

    const saveDataToStorage = async (updatedData: any[]) => {
        try {
            await AsyncStorage.setItem('flatListData', JSON.stringify(updatedData));
        } catch (error) {
            console.error('Error saving data to storage', error);
        }
    };

    const loadDataFromStorage = async () => {
        try {
            const storedData = await AsyncStorage.getItem('flatListData');
            if (storedData) {
                setSpritData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error('Error loading data from storage', error);
        }
    };

    useEffect(() => {
        loadDataFromStorage();
    }, []);

    const removeItem = (id: string) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this sprit?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => {
                        const updatedData = spritData?.filter(item => item.id !== id);
                        setSpritData(updatedData);
                        saveDataToStorage(updatedData);
                    }
                }
            ]
        );
    };

    const handleImageClick = (index: number) => {
        navigation.navigate('Action', { data: spritData });
    };

    const renderAddSpritView = () => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.addSpritView}
                onPress={pickImage}>
                <AntDesign
                    name='plus'
                    size={20}
                    color={'#000'}
                />
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.screenViewContainer}>
            <Header
                isBack={false}
                buttonText='Sign in'
                onPress={() => { }}
            />
            <View style={styles.container}>
                <View style={styles.spritImageBox}>
                    <PanGestureHandler onGestureEvent={panGestureHandler}>
                        <Animated.View>
                            {spritData.map((item, index) => {
                                return (
                                    <Animated.View key={index} style={[animatedStyle[index], styles.spritImage]}>
                                        {text[index] !== '' && (
                                            <View style={styles.spritLookView}>
                                                <Text style={styles.spritLookText}>{text[index]}</Text>
                                            </View>
                                        )}
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => setSelectedSprit(index)}>
                                            <Image
                                                source={item.uri}
                                                style={styles.spritImage}
                                            />
                                        </TouchableOpacity>
                                    </Animated.View>
                                )
                            })}
                        </Animated.View>
                    </PanGestureHandler>
                    <View style={styles.resetIconView}>
                        <Ionicons
                            name='reload-circle'
                            size={32}
                            color={'#0FBD8C'}
                            onPress={handleReset}
                        />
                    </View>
                    <View style={styles.playIconView}>
                        <Ionicons
                            name='play-circle'
                            size={48}
                            color={'#855cd6'}
                            onPress={runActions}
                        />
                    </View>
                </View>

                <View style={styles.middleView}>
                    <View style={styles.spritDetailView}>
                        <Text style={styles.spritText}>Sprit</Text>
                        <View style={styles.spritValueView}>
                            {spritData.map((item, index) => {
                                return (
                                    <React.Fragment key={index} >
                                        {index == selectedSprit && (
                                            <Text style={styles.spritValueText}>{item.spritName}</Text>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </View>
                    </View>
                    <View style={styles.spritDetailView}>
                        <Text style={styles.spritText}>X</Text>
                        <View style={styles.spritValueView}>
                            <Text style={styles.spritValueText}>{coordinates.x.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={styles.spritDetailView}>
                        <Text style={styles.spritText}>Y</Text>
                        <View style={styles.spritValueView}>
                            <Text style={styles.spritValueText}>{coordinates.y.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.spritsListView}>
                    <FlatList
                        data={spritData}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListFooterComponent={renderAddSpritView()}
                        contentContainerStyle={styles.spritsListContainer}
                        keyExtractor={(item: any, index: number) => String(item?.id ?? index)}
                        renderItem={({ item, index }: any) => {
                            return (
                                <>
                                    <View style={[styles.particularSpritView, { borderColor: index == selectedSprit ? '#855cd6' : '#E0E0E0' }]}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.paparticularSpritImgView}
                                            onPress={() => setSelectedSprit(index)}>
                                            {item?.actions?.length > 0 && (
                                                <View style={styles.actionTagView}>
                                                    <Text style={styles.actionTagViewText}>{`Action ${index + 1}`}</Text>
                                                </View>
                                            )}
                                            <Image source={item.uri} style={styles.paparticularSpritImg} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.addActionView}
                                            onPress={() => handleImageClick(index)}>
                                            <Text style={styles.addActionText}>
                                                Add Actions
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.deleteView}>
                                        <MaterialCommunityIcons
                                            name='delete-circle'
                                            size={28}
                                            color={'#855cd6'}
                                            onPress={() => removeItem(item.id)}
                                        />
                                    </View>
                                </>
                            )
                        }}
                    />
                </View>
            </View>
        </View>
    )
}