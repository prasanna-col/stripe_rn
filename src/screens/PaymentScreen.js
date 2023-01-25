import React, { useState, useEffect } from "react";
import { StyleSheet, Button, View, Alert, Text, Platform } from 'react-native';
import {
    CardField,
    CardFieldInput,
    useStripe,
} from '@stripe/stripe-react-native';
import { Constants } from "../../constant/constant";

export default PaymentScreen = () => {

    var envdata = {
        PUB_KEY: process.env.PUB_KEY,
        SEC_KEY: process.env.SEC_KEY
    }

    console.log("envdata :", envdata)

    const [card, setCard] = useState(CardFieldInput.Details | null);
    const { confirmPayment, handleCardAction } = useStripe()
    const API_URL = Platform.OS == "android" ? "http://10.0.2.2:5000/pay/checkout" : "http://localhost:5000/pay/checkout";

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    const initializePaymentSheet = async () => {


        fetch(API_URL, { // fetchPaymentSheetParams
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + `${Constants.SEC_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bill_amount: "10.00",
                currency: "inr"
            })
        })
            .then(async response => {
                const { paymentIntent, ephemeralKey, customer } = await response.json();
                var reqData = await {
                    customerId: customer,
                    customerEphemeralKeySecret: ephemeralKey,
                    paymentIntentClientSecret: paymentIntent,
                    merchantDisplayName: 'PVM',
                }

                const { error } = await initPaymentSheet(reqData)

                if (!error) {
                    setLoading(true);
                } else {
                    console.log("initPaymentSheet err :", error)
                }
            })

            .catch(error => {
                console.log("api err", error);
            });
    };

    const openPaymentSheet = async () => {
        const auth = "Bearer " + "sk_test_51MEulFSIFs9LpgQOSz5iCGMnwQX7surbNNe6Fu17NhWM4tchYvEwCwuGZ838tdHUYq3vAZas8piUEX2oOqSUJYfW00V0qhJrFQ"
        console.log("auth -->", auth)
        const { error } = await presentPaymentSheet(
            {
                'Authorization': auth
            }
        );
        // {
        //     Authorization: auth
        // },
        // {
        //     clientSecret: Constants.SEC_KEY
        // }

        if (error) {
            console.log("error -->", error)
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };
    useEffect(() => {
        initializePaymentSheet();
    }, []);
    return (
        <View style={styles.container}>
            {/* <CardField
                postalCodeEnabled={false}
                placeholder={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',
                }}
                style={{
                    width: '100%',
                    height: 50,
                    marginVertical: 30,
                }}
                onCardChange={(cardDetails) => {
                    setCard(cardDetails);
                }}
                onFocus={(focusedField) => {
                    console.log('focusField', focusedField);
                }}
            /> */}

            <Text style={{ marginBottom: 20 }}>Bill amount 10.00 INR</Text>
            <Button
                style={styles.button}
                disabled={!loading}
                title="Checkout with 10.00 (INR)"
                color="#841584"
                onPress={openPaymentSheet}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#00aeef',
        borderColor: 'red',
        borderWidth: 5,
        borderRadius: 15
    }
})