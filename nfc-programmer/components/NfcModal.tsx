import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../constants/theme';
import { NfcStatus } from '../hooks/useNfc';

interface NfcModalProps {
  visible: boolean;
  status: NfcStatus;
  mode: 'read' | 'write';
  error?: string | null;
  onCancel: () => void;
  onDone?: () => void;
}

export function NfcModal({ visible, status, mode, error, onCancel, onDone }: NfcModalProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ring1Anim = useRef(new Animated.Value(0)).current;
  const ring2Anim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in when visible
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  // Pulse ring animation
  useEffect(() => {
    if (status === 'scanning') {
      successAnim.setValue(0);
      errorAnim.setValue(0);

      const createRingAnim = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 1600,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        );

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );

      const r1 = createRingAnim(ring1Anim, 0);
      const r2 = createRingAnim(ring2Anim, 600);

      pulse.start();
      r1.start();
      r2.start();

      return () => {
        pulse.stop();
        r1.stop();
        r2.stop();
      };
    } else if (status === 'success') {
      pulseAnim.setValue(1);
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }).start();
    } else if (status === 'error') {
      pulseAnim.setValue(1);
      Animated.spring(errorAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [status]);

  const getTitle = () => {
    if (status === 'success') return mode === 'write' ? 'Write Successful!' : 'Tag Read!';
    if (status === 'error') return 'Something went wrong';
    return mode === 'write' ? 'Ready to Write' : 'Ready to Scan';
  };

  const getSubtitle = () => {
    if (status === 'success')
      return mode === 'write'
        ? 'Data has been written to the NFC tag.'
        : 'Tag scanned successfully.';
    if (status === 'error') return error ?? 'An unknown error occurred.';
    return Platform.OS === 'ios'
      ? 'Hold your iPhone near the NFC tag'
      : 'Hold your phone near the NFC tag';
  };

  const accentColor =
    status === 'success' ? Colors.success : status === 'error' ? Colors.error : Colors.accent;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.sheet}>
          {/* Animated NFC rings */}
          <View style={styles.iconArea}>
            {/* Ring 1 */}
            {status === 'scanning' && (
              <Animated.View
                style={[
                  styles.ring,
                  {
                    borderColor: accentColor,
                    opacity: ring1Anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
                    transform: [
                      {
                        scale: ring1Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] }),
                      },
                    ],
                  },
                ]}
              />
            )}
            {/* Ring 2 */}
            {status === 'scanning' && (
              <Animated.View
                style={[
                  styles.ring,
                  {
                    borderColor: accentColor,
                    opacity: ring2Anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
                    transform: [
                      {
                        scale: ring2Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] }),
                      },
                    ],
                  },
                ]}
              />
            )}

            {/* Center icon */}
            <Animated.View
              style={[
                styles.iconCircle,
                { borderColor: accentColor, backgroundColor: `${accentColor}18` },
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {status === 'success' && (
                <Animated.View
                  style={{ transform: [{ scale: successAnim }], opacity: successAnim }}
                >
                  <Ionicons name="checkmark-circle" size={56} color={Colors.success} />
                </Animated.View>
              )}
              {status === 'error' && (
                <Animated.View style={{ transform: [{ scale: errorAnim }], opacity: errorAnim }}>
                  <Ionicons name="close-circle" size={56} color={Colors.error} />
                </Animated.View>
              )}
              {status === 'scanning' && (
                <Ionicons
                  name={mode === 'write' ? 'pencil' : 'scan'}
                  size={40}
                  color={accentColor}
                />
              )}
            </Animated.View>
          </View>

          {/* Text */}
          <Text style={[styles.title, { color: accentColor }]}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>

          {/* NFC waves icon below for scanning */}
          {status === 'scanning' && (
            <View style={styles.waveContainer}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.wave,
                    {
                      width: 8 + i * 20,
                      height: 8 + i * 20,
                      borderRadius: 4 + i * 10,
                      borderColor: `${Colors.accent}${40 - i * 10}`,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Buttons */}
          <View style={styles.actions}>
            {(status === 'success' || status === 'error') ? (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: accentColor }]}
                onPress={onDone ?? onCancel}
              >
                <Text style={styles.buttonText}>{status === 'error' ? 'Try Again' : 'Done'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  iconArea: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  wave: {
    borderWidth: 1.5,
  },
  actions: {
    width: '100%',
  },
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  cancelButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
  },
});
