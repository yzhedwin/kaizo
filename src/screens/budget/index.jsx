import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Balance from "../../components/cards/Balance";
import { FocusAwareStatusBar } from "../../components/statusbar/FocusAwareStatusBar";
import BudgetHeader from "../../components/headers/BudgetHeader";
import SwipeableFlatList from "react-native-swipeable-list";
import BudgetBlock from "../../components/headers/BudgetBlock";
import PieChart from "../../components/cards/PieChart";
import QuickActions from "../../utils/QuickActions";
import TransactionCard from "../../components/cards/Transaction";
import { Colors, Typography } from "../../utils/Styles";

/*
# Budget tracking #
Allow user to input expenses easily and set budget.
Allow user to see current budget and projected expenses
Allow user to see daily/weekly expenses
Categorised expenditure 
*/

export default function BudgetScreen({ navigation }) {
  const focused = useIsFocused();

  const [currency, setCurrency] = useState({});
  const [totalBudget, setTotalBudget] = useState(1000);
  const [totalExpenses, setTotalExpenses] = useState(100);
  const [transactions, setTransactions] = useState([]);

  // useEffect(() => {
  //   getTransactions(setTransactions);
  //   getCurrency(setCurrency);
  //   getTotalIncomes(setTotalIncomes);
  //   getTotalExpenses(setTotalExpenses);
  // }, [focused]);

  // Delete Item
  // const __delete = (id) => {
  //   deleteTransaction(id);
  //   getTransactions(setTransactions);
  //   getTotalIncomes(setTotalIncomes);
  //   getTotalExpenses(setTotalExpenses);
  // };

  // Update Item
  // const __update = (item) => {
  //   navigation.navigate(routes.AddTransaction, { item: item });
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"gold", paddingBottom:-35 }}>
      <FocusAwareStatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <BudgetHeader />
        <View style={styles.bodyContainer}>
          <SwipeableFlatList
            data={transactions.slice(0, 5)}
            maxSwipeDistance={140}
            shouldBounceOnMount={true}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderQuickActions={({ index, item }) =>
              QuickActions(item, __update, __delete)
            }
            ListHeaderComponent={() => {
              return (
                <View>
                  {/* // Balance */}
                  <View style={{ paddingLeft: 20, paddingTop: 10 }}>
                    <Balance
                      currency={currency.symbol}
                      budget={totalBudget}
                      expenses={totalExpenses}
                    />
                  </View>
                  <View style={{paddingLeft: 20 }}>
                    <BudgetBlock
                      title="Transactions"
                      onPress={() => navigation.navigate("Transactions")}
                    />
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => {
              return (
                <View style={styles.emptyContainer}>
                   <Text style={[Typography.TAGLINE, {color: Colors.WHITE, textAlign: 'center'}]}>
                    There are no transactions!
                  </Text>
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              return (
                <TransactionCard
                  currency={currency.symbol}
                  key={index}
                  transaction={item}
                />
              );
            }}
            ListFooterComponent={() => {
              return (
                // Statistics
                <View style={{ paddingLeft: 20, marginBottom: 20 }}>
                  <BudgetBlock title="Statistics" />
                  <PieChart incomes={totalBudget} expenses={totalExpenses} />
                </View>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Body
  bodyContainer: {
    flex: 1,
    padding: 20,
    paddingLeft: 0,
    paddingBottom: 0,
    backgroundColor: Colors.BLACK,
  },
  emptyContainer: {
    padding: 20,
  },
});
