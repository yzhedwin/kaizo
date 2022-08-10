import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';


const Back = (props) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{padding: 5, alignItems: 'flex-start'}}
                onPress={() => navigation.goBack()}>
                    <Icon name="chevron-left" color={"white"} size={20} />
            </TouchableOpacity>

            <Text style={ {color: "white"}}>{props.title}</Text>
            
            <Icon name="chevron-right" color={"black"} size={25} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
 
export default Back;