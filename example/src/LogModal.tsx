import React from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface LogModalProps {
  visible: boolean;
  logs: string[];
  onClose: () => void;
  onClearLogs: () => void;
}

const LogModal: React.FC<LogModalProps> = ({ visible, logs, onClose, onClearLogs }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Logs</Text>
          </View>
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            {logs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <Text style={styles.logIndex}>{index + 1}.</Text>
                <Text style={styles.logText}>{log}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClearLogs}>
              <Text style={styles.closeButtonText}>Clear Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'green',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: 'green',
    paddingVertical: 10,
  },
  footer: {
    borderTopWidth: 2,
    borderTopColor: 'green',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginVertical: 10,
  },
  contentContainerStyle: {
    paddingVertical: 5,
  },
  logItem: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  logIndex: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'green',
  },
  logText: {
    fontSize: 14,
    color: 'white',
    marginVertical: 5,
  },
  closeButton: {
    borderRadius: 10,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LogModal;
