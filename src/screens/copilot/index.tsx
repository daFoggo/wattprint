import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/common/themed-text';
import { ThemedView } from '@/components/common/themed-view';
import { Spacing } from '@/constants/theme';

export function CopilotScreen() {
  return (
    <ThemedView style={styles.root}>
      <View style={styles.container}>
        <ThemedText type="subtitle">AI Energy Copilot</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Chưa triển khai. Đây là skeleton của page copilot.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
