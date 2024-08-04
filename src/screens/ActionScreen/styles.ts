import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    screenViewContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        columnGap: 8
    },
    codeView: {
        flex: 1,
        height: '100%',
        justifyContent: 'flex-start',
        backgroundColor: '#f6f6f6',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        overflow: 'hidden'
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 4,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    codeText: {
        fontSize: 20,
        lineHeight: 24,
        color: '#855cd6',
        fontWeight: '700'
    },
    blockActionView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    blockView: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        rowGap: 8,
        borderRightWidth: 1,
        borderColor: '#E0E0E0',
        padding: 4
    },
    blockItemsView: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 4
    },
    circleView: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 0.7,
        alignSelf: 'center'
    },
    blockItemsTextView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4
    },
    blockItemsText: {
        textAlign: 'center',
        fontSize: 10,
        lineHeight: 14,
        fontWeight: 500
    },
    selectActionView: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        rowGap: 8,
        borderRightWidth: 1,
        borderColor: '#E0E0E0',
        padding: 4
    },
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 16
    },
    emptyText: {
        color: '#000',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 18
    },
    actionsContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'flex-start',
        backgroundColor: '#f6f6f6',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        overflow: 'hidden'
    },
    actionsView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 4,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    actionsText: {
        fontSize: 20,
        lineHeight: 24,
        color: '#0FBD8C',
        fontWeight: '700'
    },
    actionTabViewContainer: {
        flexGrow: 1
    },
    actionTabView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    actionTabText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 18
    },
    selectedActionView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#855cd6',
        paddingVertical: 4,
        paddingHorizontal: 16,
        borderRadius: 4
    },
    selectedActionText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 16
    },
    deleteIcon: {
        position: 'absolute',
        top: -5,
        right: -5
    }
});
