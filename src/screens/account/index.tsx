import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Fonts, WattPrintTokens } from '@/constants/theme';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ACCOUNT_GROUPS } from '@/features/energy/mock';

export function AccountScreen() {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Identity on Ground */}
        <View style={styles.groundHeader}>
          <Text style={styles.title}>Account</Text>
          <View style={styles.profileRow}>
            <Box style={styles.avatar}>
              <Text style={styles.avatarText}>MK</Text>
            </Box>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Minh Khoa</Text>
              <Text style={styles.userEmail}>khoa.tran@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Paired Status Cards */}
        <View style={styles.pairedGrid}>
          <Card
            className="border-0 shadow-none bg-white rounded-[20px] p-4 gap-1.5"
            style={styles.statusCard}>
            <Text style={styles.statusEyebrow}>TARIFF</Text>
            <Text style={styles.statusValue}>Household</Text>
          </Card>
          <Card
            className="border-0 shadow-none bg-white rounded-[20px] p-4 gap-1.5"
            style={styles.statusCard}>
            <Text style={styles.statusEyebrow}>SENSOR</Text>
            <Text style={styles.statusValue}>Connected</Text>
          </Card>
        </View>

        {/* Grouped Settings Cards */}
        {ACCOUNT_GROUPS.map((group) => (
          <Card
            key={group.title}
            className="border-0 shadow-none bg-white rounded-[20px] p-5 pb-2 gap-1"
            style={styles.groupCard}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupItems}>
              {group.items.map((item: { label: string; value: string }, idx: number) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.value ? (
                    <Text style={styles.itemValue}>{item.value}</Text>
                  ) : (
                    <Text style={styles.itemChevron}>›</Text>
                  )}
                </View>
              ))}
            </View>
          </Card>
        ))}

        {/* Sign Out Button */}
        <Pressable style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: WattPrintTokens.colors.neutralGround, // #F2F4ED
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 12,
  },
  groundHeader: {
    paddingHorizontal: 8,
    gap: 16,
    paddingBottom: 6,
  },
  title: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 24,
    color: WattPrintTokens.colors.primary, // #164437
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: WattPrintTokens.radii.pill,
    backgroundColor: WattPrintTokens.colors.tertiary, // #B5E930
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 19,
    color: WattPrintTokens.colors.primary, // #164437
  },
  profileInfo: {
    gap: 2,
  },
  userName: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 17,
    color: WattPrintTokens.colors.primary, // #164437
  },
  userEmail: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  pairedGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 5,
  },
  statusEyebrow: {
    fontFamily: Fonts.monoMedium,
    fontSize: 10.5,
    letterSpacing: 1.05,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  statusValue: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 16,
    color: WattPrintTokens.colors.primary, // #164437
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.xl, // 20px
    paddingVertical: 18,
    paddingHorizontal: 22,
    paddingBottom: 8,
    gap: 4,
  },
  groupTitle: {
    fontFamily: Fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 1.1,
    color: WattPrintTokens.colors.accentDeep, // #2F7A0C
  },
  groupItems: {
    gap: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  itemLabel: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    color: WattPrintTokens.colors.primary, // #164437
  },
  itemValue: {
    fontFamily: Fonts.monoMedium,
    fontSize: 12,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  itemChevron: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 18,
    color: WattPrintTokens.colors.secondary, // #4A6B60
  },
  signOutBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: WattPrintTokens.radii.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 4,
  },
  signOutText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 14,
    color: WattPrintTokens.colors.primary, // #164437
  },
});
