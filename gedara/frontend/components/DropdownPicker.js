import React from 'react';
import { Picker } from '@react-native-picker/picker';

const DropdownPicker = ({ selectedValue, onValueChange, items, prompt }) => (
  <Picker
    selectedValue={selectedValue}
    onValueChange={onValueChange}
    style={{ width: '100%', height: 50 }}
  >
    <Picker.Item label={prompt} value="" />
    {items.map(({ id, label }) => (
      <Picker.Item key={id} label={label} value={id} />
    ))}
  </Picker>
);

export default DropdownPicker;
