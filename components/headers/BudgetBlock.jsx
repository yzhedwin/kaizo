import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const BudgetBlock = (props) => {
    return (
        <View style={styles.container}>
            <Text style={{color:"white"}}>{props.title}</Text>
            
            {props?.onPress ?
                <Pressable 
                    style={styles.rowContainer}
                    onPress={props.onPress}>
                        <Text style={{color: "gray", marginRight: 5}}>All</Text>
                        <Icon name="chevron-right" color={"gray"} size={10} />
                </Pressable>
            : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "black"
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
 
export default BudgetBlock;
 