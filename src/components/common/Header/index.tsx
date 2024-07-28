
import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ImagePath } from '../../../utils/helper/constants';
interface headerTypes {
    isBack: boolean;
    buttonText: string;
    onPress: () => void;
}

export const Header = React.memo((props: headerTypes) => {
    const navigation = useNavigation<any>();
    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerLogoBox}>
                {props.isBack && (
                    <MaterialIcons
                        name='arrow-back'
                        size={24}
                        color={'#fff'}
                        onPress={() => navigation.goBack()}
                    />
                )}
                <Image
                    source={ImagePath.headerLogo}
                    style={styles.headerLogoStyle}
                />
            </View>

            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.textView}
                onPress={props.onPress}
            >
                <Text style={styles.textStyle}>
                    {props.buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    )
});