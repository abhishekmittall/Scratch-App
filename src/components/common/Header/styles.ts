import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    headerContainer: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#855cd6'
    },
    headerLogoBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        columnGap: 24
    },
    headerLogoStyle: {
        width: 131,
        height: 44,
        resizeMode: 'cover',
    },
    textView: {
        paddingHorizontal: 8,
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    textStyle: {
        fontSize: 16,
        lineHeight: 20,
        color: '#fff'
    }
});