import { Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { styles } from './styles';
import { ImagePath } from '../../utils/helper/constants';

export const SplashScreen: React.FC = ({ }: any) => {
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setIsReady(true);
        }, 3000);
    }, []);
    if (!isReady) {
        return (
            <View style={styles.container}>
                <Image
                    source={ImagePath.splashIcon}
                    style={styles.image}
                />
            </View>
        );
    }

    return null;
}