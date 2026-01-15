import { Modal, Pressable, Text, View } from 'react-native';
import { Instrument } from '../../types/instruments';

const OrderModal = ({
  instrument,
  onClose,
}: {
  instrument: Instrument | null;
  onClose: () => void;
}) => {
  return (
    <Modal visible={!!instrument} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} />

      <View style={{ padding: 16, backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        <Text style={{ fontWeight: '900', fontSize: 18 }}>
          {instrument?.ticker} — {instrument?.name}
        </Text>

        <Text style={{ marginTop: 12, opacity: 0.7 }}>
          (Acá voy a poner formulario BUY/SELL + MARKET/LIMIT)
        </Text>

        <Pressable onPress={onClose} style={{ marginTop: 16, padding: 12, borderRadius: 10, backgroundColor: '#eee' }}>
          <Text style={{ textAlign: 'center', fontWeight: '700' }}>Cerrar</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default OrderModal;