import { View, Text } from "react-native";

import { Picker } from "@react-native-picker/picker";

export default function PickerItem({ coins, coinSelected, onChange }) {
  let moedasPicker = coins.map((item, index) => {
    return <Picker.Item value={item.key} key={index} label={item.key} />;
  });
  return (
    <Picker
      selectedValue={coinSelected}
      onValueChange={(value) => onChange(value)}
    >
      {moedasPicker}
    </Picker>
  );
}
