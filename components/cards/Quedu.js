import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../src/colors";

export const Quedu = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nombre del Quedu</Text>
      <Text style={styles.text}>02/04</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: colors.gray,
    minWidth: "85%",
    borderRadius: 4,
  },
  text: {
    fontSize: 10,
    fontFamily: "Quicksand-SemiBold",
  }
});
