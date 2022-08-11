import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const QuickActions = (item, updateItem, deleteItem) => {
    return (
        <View style={styles.container}>
            <View style={[styles.button, {marginLeft: 10, backgroundColor: "green"}]}>
                <TouchableOpacity onPress={() => updateItem(item)}>
                    <Icon name="pen" color={"white"} size={15} />
                </TouchableOpacity>
            </View>
            <View style={[styles.button, {backgroundColor: "red", marginLeft: 10}]}>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <Icon name="trash" color={"white"} size={15} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        width: 60,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default QuickActions;