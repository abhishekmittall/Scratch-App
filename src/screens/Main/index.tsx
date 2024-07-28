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
    withSpring
} from 'react-native-reanimated';

export const Main: React.FC = ({ navigation }: any) => {

    const [actions, setActions] = useState<any[]>([]);
    const defaultCoordinates = { x: 0, y: 0 };
    const [coordinates, setCoordinates] = useState(defaultCoordinates);
    const translationX = useSharedValue(defaultCoordinates.x);
    const translationY = useSharedValue(defaultCoordinates.y);
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const [repeatedActions, setRepeatedActions] = useState<any[]>([]);
    const [play, setPlay] = useState(false);
    const [text, setText] = useState<any>('');
    const [dragging, setDragging] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchActions = async () => {
                const storedActions = await AsyncStorage.getItem('droppedItems');
                if (storedActions) {
                    setActions(JSON.parse(storedActions));
                }
            };
            fetchActions();
        }, [])
    );

    useEffect(() => {
        if (play) {
            runActions();
        }
    }, [play, actions]);

    const runActions = (index: number = 0) => {
        if (index >= actions.length) {
            if (repeatedActions.length > 0) {
                setActions([...actions, ...repeatedActions]);
                runActions(0); // Repeat the actions
            }
            return;
        }
        const action = actions[index];
        switch (action.type) {
            case 'moveX':
                translationX.value = withTiming(translationX.value + action.value, { duration: 500 }, () => runOnJS(runActions)(index + 1));
                break;
            case 'moveY':
                translationY.value = withTiming(translationY.value + action.value, { duration: 500 }, () => runOnJS(runActions)(index + 1));
                break;
            case 'rotate':
                rotation.value = withTiming(rotation.value + action.value, { duration: 500 }, () => runOnJS(runActions)(index + 1));
                break;
            case 'goTo':
                translationX.value = withTiming(action.value.x, { duration: 500 });
                translationY.value = withTiming(action.value.y, { duration: 500 }, () => runOnJS(runActions)(index + 1));
                setCoordinates({ x: action.value.x, y: action.value.y });
                break;
            case 'moveXY':
                translationX.value = withTiming(translationX.value + action.x, { duration: 500 });
                translationY.value = withTiming(translationY.value + action.y, { duration: 500 }, () => runOnJS(runActions)(index + 1));
                break;
            case 'random':
                translationX.value = withTiming(Math.random() * 300, { duration: 500 });
                translationY.value = withTiming(Math.random() * 300, { duration: 500 }, () => runOnJS(runActions)(index + 1));
                setCoordinates({ x: Math.random() * 300, y: Math.random() * 300 });
                break;
            case 'sayHello':
                setText('Hello');
                break;
            case 'sayHelloFor1Sec':
                setText('Hello');
                setTimeout(() => {
                    setText('');
                }, 1000);
                break;
            case 'increaseSize':
                scale.value = withTiming(scale.value + 0.5, { duration: 500 }, () => runOnJS(runActions)(index + 1));
                break;
            case 'decreaseSize':
                scale.value = withTiming(Math.max(0.5, scale.value - 0.1), { duration: 500 }, () => runOnJS(runActions)(index + 1));
                break;
            case 'repeat':
                setRepeatedActions([...actions]);
                runOnJS(runActions)(index + 1);
                break;
        }
    };


    const handlePlay = () => {
        setPlay(!play);
    };

    const handleReset = () => {
        translationX.value = withSpring(defaultCoordinates.x);
        translationY.value = withSpring(defaultCoordinates.y);
        rotation.value = 0;
        setCoordinates(defaultCoordinates);
        setText('');
        scale.value = 1;
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translationX.value },
                { translateY: translationY.value },
                { rotate: `${rotation.value}deg` },
                { scale: scale.value },
            ],
        };
    });

    const panGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { startX: number; startY: number }
    >({
        onStart: (_, ctx) => {
            ctx.startX = translationX.value;
            ctx.startY = translationY.value;
            runOnJS(setDragging)(true);
        },
        onActive: (event, ctx) => {
            translationX.value = ctx.startX + event.translationX;
            translationY.value = ctx.startY + event.translationY;
            runOnJS(setCoordinates)({ x: translationX.value, y: translationY.value });
        },
        onEnd: () => {
            translationX.value = translationX.value;
            translationY.value = translationY.value;
            runOnJS(setDragging)(false);
        },
    });


    const clearAsyncStorage = async () => {
        await AsyncStorage.clear();
    };

    useEffect(() => {
        clearAsyncStorage();
    }, []);

    const resetSpritPosition = () => {
        translationX.value = withSpring(defaultCoordinates.x);
        translationY.value = withSpring(defaultCoordinates.y);
        rotation.value = 0;
        setCoordinates(defaultCoordinates);
        setText('');
        setRepeatedActions([]);
    };

    useFocusEffect(
        React.useCallback(() => {
            resetSpritPosition();
        }, [])
    );

    const defaultSprit = { id: 1, uri: ImagePath.catSprite, text: 'Cat', spritName: 'Cat' }
    const [data, setData] = useState<any[]>([defaultSprit]);
    const [selectedSprit, setSelectedSprit] = useState<number>(0);

    const pickImage = () => {
        ImagePicker.openPicker({
            width: 48,
            height: 48,
            cropping: true
        }).then(image => {
            const newItem: any = {
                id: image.path.split('/').pop() || Math.random().toString(),
                uri: { uri: image.path },
                text: `Item ${data.length + 1}`,
                spritName: 'Ball',
            };
            const updatedData = [...data, newItem];
            setData(updatedData);
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
                setData(JSON.parse(storedData));
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
                        const updatedData = data.filter(item => item.id !== id);
                        setData(updatedData);
                        saveDataToStorage(updatedData);
                    }
                }
            ]
        );
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
                            {data.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {index == selectedSprit && (
                                            <Animated.View style={[animatedStyle, styles.spritImage]}>
                                                {text && (
                                                    <View style={styles.spritLookView}>
                                                        <Text style={styles.spritLookText}>{text}</Text>
                                                    </View>
                                                )}
                                                <Image
                                                    source={item.uri}
                                                    style={styles.spritImage}
                                                />
                                            </Animated.View>
                                        )}

                                    </React.Fragment>
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
                            onPress={handlePlay}
                        />
                    </View>
                </View>

                <View style={styles.middleView}>
                    <View style={styles.spritDetailView}>
                        <Text style={styles.spritText}>Sprit</Text>
                        <View style={styles.spritValueView}>
                            {data.map((item, index) => {
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
                        data={data}
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
                                            <Image source={item.uri} style={styles.paparticularSpritImg} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={styles.addActionView}
                                            onPress={() => navigation.navigate('Action')}>
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