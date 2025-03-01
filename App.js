import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { useState, useEffect } from "react";

import PickerItem from "./src/Picker";

import { api } from "./src/services/api";

export default function App() {
  const [data, setData] = useState([]);

  const [coin, setCoin] = useState(null);

  const [loading, setLoading] = useState(true);

  const [inputCoin, setInputCoin] = useState("");

  const [coinValue, setCoinValue] = useState(null);

  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    const handleRequest = async () => {
      const response = await api.get("all");

      let coinArray = [];

      Object.keys(response.data).map((key) => {
        coinArray.push({
          key: key,
          label: key,
          value: key,
        });
      });

      setData(coinArray);

      setCoin(coinArray[0].key);

      setLoading(false);
    };

    handleRequest();
  }, []);

  const convert = async () => {
    if (inputCoin === 0 || inputCoin === "" || coin === null) {
      return;
    }

    const response = await api.get(`all/${coin}-BRL`);

    console.log(response.data[coin].ask);

    let result = response.data[coin].ask * parseFloat(inputCoin);

    setConvertedValue(
      `${result.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`
    );

    setCoinValue(inputCoin);

    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#101215",
        }}
      >
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  } else {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.coinArea}>
            <Text style={styles.title}>Selecione sua moeda</Text>
            <PickerItem
              coins={data}
              coinSelected={coin}
              onChange={(coin) => {
                setCoin(coin);
              }}
            />
          </View>

          <View style={styles.valueArea}>
            <Text style={styles.title}>
              Digite um valor para converter em (R$)
            </Text>
            <TextInput
              placeholder="Exemplo: 1.50"
              style={styles.input}
              keyboardType="numeric"
              value={inputCoin}
              onChangeText={(value) => setInputCoin(value)}
            />
          </View>

          <TouchableOpacity style={styles.btnArea} onPress={convert}>
            <Text style={styles.btnText}>Converter</Text>
          </TouchableOpacity>

          {convertedValue !== 0 && (
            <View style={styles.resultArea}>
              <Text style={styles.convertedValue}>
                {coinValue} {coin}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  margin: 8,
                  fontWeight: "500",
                  color: "#fb4b57",
                }}
              >
                Corresponde a:
              </Text>
              <Text style={styles.convertedValue}>R$ {convertedValue}</Text>
            </View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101215",
    paddingTop: 40,
    alignItems: "center",
  },
  coinArea: {
    backgroundColor: "#f9f9f9",
    width: "90%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 8,
    marginBottom: 1,
  },
  title: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    paddingLeft: 5,
    paddingTop: 5,
  },
  valueArea: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    width: "100%",
    padding: 8,
    fontSize: 18,
    color: "#000",
  },
  btnArea: {
    width: "90%",
    backgroundColor: "#fb4b57",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultArea: {
    width: "90%",
    backgroundColor: "#f9f9f9",
    marginTop: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  convertedValue: {
    fontSize: 28,
    color: "#000",
    fontWeight: "bold",
  },
});
