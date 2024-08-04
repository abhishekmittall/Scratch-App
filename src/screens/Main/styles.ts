import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screenViewContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        padding: 8,
        paddingBottom: 24,
        rowGap: 8
    },
    spritImageBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center'

    },
    spritAnimatedView: {
        width: 100,
        height: 100
    },
    spritImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        rowGap: 8,
    },
    spritLookView: {
        backgroundColor: '#855cd6',
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        position: 'absolute',
        top: -30,
        right: 0
    },
    spritLookText: {
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 16,
        color: '#fff'
    },
    resetIconView: {
        position: 'absolute',
        top: -8,
        right: -8
    },
    playIconView: {
        position: 'absolute',
        bottom: 20,
        right: -12
    },
    middleView: {
        height: 60,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    spritDetailView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: 4
    },
    spritText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000'
    },
    spritValueView: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8
    },
    spritValueText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center'
    },
    spritsListView: {
        height: 110,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    spritsListContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 8,
        columnGap: 8
    },
    addSpritView: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        overflow: 'hidden'
    },
    particularSpritView: {
        width: 100,
        height: 100,
        justifyContent: 'flex-end',
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden'
    },
    paparticularSpritImgView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actionTagView: {
        backgroundColor: '#0FBD8C',
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 999,
        bottom: 10
    },
    actionTagViewText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 10,
        lineHeight: 16
    },
    paparticularSpritImg: {
        width: 48,
        height: 48,
        resizeMode: 'contain'
    },
    addActionView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#855cd6',
        padding: 6,
    },
    addActionText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 10,
        lineHeight: 16
    },
    deleteView: {
        position: 'absolute',
        top: -5,
        right: -5
    }
});
