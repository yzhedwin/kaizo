import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Transaction = (props) => {
    const transaction = props.transaction;
    const currency = props.currency;

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Icon name={transaction.icon} color={"white"} size={15} />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={{color: "white"}}>{transaction.category}</Text>
                <Text style={{color: "dark-gray"}}>{transaction.transaction_date}</Text>
            </View>

            <Text style={transaction.type == 'income' ? {color: "green"} : {color: "red"}}>
                {transaction.type == 'income' ? '+' : '-'}{currency} {transaction.amount}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "black"
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "light-black"
    },
    detailsContainer: {
        flex: 1, 
        marginLeft: 10, 
        marginRight: 10,
        justifyContent: 'space-between'
    }
});
 
export default Transaction;