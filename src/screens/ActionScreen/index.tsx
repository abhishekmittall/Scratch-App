import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles'
import { Header } from '../../components/common';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { actionData } from '../../utils/helper/actionData';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    runOnJS,
} from 'react-native-reanimated';

const getColorForIndex = (index: any) => {
    const hue = (index * 55) % 360;
    const bgColor = `hsl(${hue}, 60%, 80%)`;
    const borderColor = `hsl(${hue}, 100%, 50%)`;
    return { bgColor, borderColor }
};

export const ActionScreen: React.FC = ({ route, navigation }: any) => {
    const { data } = route.params;
    const [droppedItems, setDroppedItems] = useState<any[]>(data);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    useEffect(() => {
        const fetchStoredItems = async () => {
            const storedItems = await AsyncStorage.getItem('droppedItems');
            if (storedItems) {
                setDroppedItems(JSON.parse(storedItems));
            }
        };
        fetchStoredItems();
    }, []);

    const handleDrop = (index: any, action: any) => {
        setDroppedItems((prevItems) => {
            if (!prevItems[index]?.actions.some((item: any) => item.id === action.id)) {
                const updatedImages = [...prevItems];
                updatedImages[index].actions.push(action);
                return updatedImages;
            }
            return prevItems;
        });
    };

    const handleRemoveAction = (id: number) => {
        setDroppedItems((prev) => {
            const newActions = [...prev];
            const index = newActions.findIndex(item => item?.id == selectedTab + 1);
            newActions[index].actions = newActions[index].actions.filter((a: any) => a.id !== id);
            return newActions;
        });
    };

    const handleDone = async () => {
        await AsyncStorage.setItem('droppedItems', JSON.stringify(droppedItems));
        navigation.goBack();
    };

    const [selectedAction, setSelectedAction] = useState<any>({});
    const [selectedActionIndex, setSelectedActionIndex] = useState<number>();
    const handleSelectAction = (item: any, index: number) => {
        setSelectedAction(item);
        setSelectedActionIndex(index);
    };

    const renderBlockItem = ({ item, index }: { item: any, index: number }) => (
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.blockItemsView}
            onPress={() => handleSelectAction(item, index)} >
            <View style={[styles.circleView, { backgroundColor: getColorForIndex(index).bgColor, borderColor: getColorForIndex(index).borderColor }]} />
            <View style={styles.blockItemsTextView}>
                <Text style={[styles.blockItemsText, { color: item.id === selectedAction.id ? '#855cd6' : '#000' }]}>
                    {item.title}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.screenViewContainer}>
            <Header
                isBack={true}
                buttonText='Done'
                onPress={handleDone}
            />
            <View style={styles.container}>
                {/* Code Block */}
                <View style={styles.codeView}>
                    <View style={styles.codeContainer}>
                        <MaterialCommunityIcons
                            name='code-tags'
                            size={28}
                            color={'#855cd6'}
                        />
                        <Text style={styles.codeText}>CODE</Text>
                    </View>

                    <View style={styles.blockActionView}>
                        {/* Block */}
                        <View>
                            <FlatList
                                data={actionData}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.blockView}
                                keyExtractor={(item: any, index: number) => String(item?.id ?? index)}
                                renderItem={renderBlockItem}
                            />
                        </View>

                        {/* Action Block */}
                        <View style={styles.screenViewContainer}>
                            <FlatList
                                data={selectedAction?.actions}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.selectActionView}
                                keyExtractor={(item: any, index: number) => String(item?.id ?? index)}
                                ListEmptyComponent={
                                    <View style={styles.emptyView}>
                                        <Text style={styles.emptyText}>
                                            Please select any action block!
                                        </Text>
                                    </View>
                                }
                                renderItem={({ item, index }: any) => {
                                    return (
                                        <DraggableItem action={item} index={selectedActionIndex} onDrop={(action: any) => handleDrop(selectedTab, action)} />
                                    )
                                }}
                            />
                        </View>
                    </View>
                </View>

                {/* Action Block */}
                <View style={styles.actionsContainer}>
                    <View style={styles.actionsView}>
                        <MaterialCommunityIcons
                            name='flag'
                            size={28}
                            color={'#0FBD8C'}
                        />
                        <Text style={styles.actionsText}>ACTION</Text>
                    </View>
                    <View>
                        <FlatList
                            data={data}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.actionTabViewContainer}
                            keyExtractor={(item: any, index: number) => String(item?.id ?? index)}
                            renderItem={({ item, index }: any) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        style={[styles.actionTabView, {
                                            backgroundColor:
                                                selectedTab === index ? '#0FBD8C' : '#E0E0E0',
                                        }]}
                                        onPress={() => setSelectedTab(index)}>
                                        <Text style={styles.actionTabText}>
                                            Action {index + 1}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                    <View style={styles.screenViewContainer}>
                        <FlatList
                            data={droppedItems[selectedTab]?.actions}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.selectActionView}
                            keyExtractor={(item: any, index: number) => String(item?.id ?? index)}
                            ListEmptyComponent={
                                <View style={styles.emptyView}>
                                    <Text style={styles.emptyText}>
                                        No one action selected!
                                    </Text>
                                </View>
                            }
                            renderItem={({ item, index }: any) => {
                                return (
                                    <View style={styles.selectedActionView}>
                                        <Text style={styles.selectedActionText}>
                                            {item.description}
                                        </Text>
                                        <View style={styles.deleteIcon}>
                                            <MaterialCommunityIcons
                                                name='delete-circle'
                                                size={24}
                                                color={'#fff'}
                                                onPress={() => handleRemoveAction(item.id)}
                                            />
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

const DraggableItem: React.FC<any> = ({ action, index, onDrop }) => {
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);

    const panGestureHandler = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        { startX: number; startY: number }
    >({
        onStart: (event, context) => {
            context.startX = translationX.value;
            context.startY = translationY.value;
        },
        onActive: (event, context) => {
            translationX.value = context.startX + event.translationX;
            translationY.value = context.startY + event.translationY;
        },
        onEnd: () => {
            if (Math.abs(translationX.value) > 100 || Math.abs(translationY.value) > 100) {
                runOnJS(onDrop)(action);
            }
            translationX.value = 0;
            translationY.value = 0;
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translationX.value },
                { translateY: translationY.value },
            ],
        };
    });

    return (
        <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.selectedActionView, animatedStyle, { backgroundColor: getColorForIndex(index).bgColor }]}>
                <Text style={[styles.selectedActionText, { color: '#000' }]}>
                    {action.description}
                </Text>
            </Animated.View>
        </PanGestureHandler>
    );
};