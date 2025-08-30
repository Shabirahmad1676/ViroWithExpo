import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const PrivacyPolicy = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#ffffff" /> */}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Last Updated */}
          <View style={styles.lastUpdated}>
            <Text style={styles.lastUpdatedText}>Last Updated: {new Date().toLocaleDateString()}</Text>
          </View>

          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to BirCube. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our mobile application.
            </Text>
          </View>

          {/* Information We Collect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information We Collect</Text>
            
            <Text style={styles.subTitle}>Personal Information:</Text>
            <Text style={styles.paragraph}>
              • Account information (name, email address, profile picture){'\n'}
              • Location data when you use map features{'\n'}
              • Camera and photo data when you capture images{'\n'}
              • Device information and usage statistics
            </Text>

            <Text style={styles.subTitle}>Automatically Collected Data:</Text>
            <Text style={styles.paragraph}>
              • Device identifiers and IP addresses{'\n'}
              • App usage patterns and preferences{'\n'}
              • Technical information about your device{'\n'}
              • Crash reports and performance data
            </Text>
          </View>

          {/* How We Use Your Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the collected information to:{'\n\n'}
              • Provide and maintain our services{'\n'}
              • Personalize your experience{'\n'}
              • Improve our app functionality{'\n'}
              • Send important updates and notifications{'\n'}
              • Ensure app security and prevent fraud{'\n'}
              • Comply with legal obligations
            </Text>
          </View>

          {/* Data Sharing */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sharing and Disclosure</Text>
            <Text style={styles.paragraph}>
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your data only in the following circumstances:{'\n\n'}
              • With your explicit consent{'\n'}
              • To comply with legal requirements{'\n'}
              • To protect our rights and safety{'\n'}
              • With trusted service providers who assist in app operations
            </Text>
          </View>

          {/* Data Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate security measures to protect your personal information:{'\n\n'}
              • Encryption of data in transit and at rest{'\n'}
              • Regular security assessments{'\n'}
              • Access controls and authentication{'\n'}
              • Secure data storage practices
            </Text>
          </View>

          {/* Your Rights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to:{'\n\n'}
              • Access your personal data{'\n'}
              • Correct inaccurate information{'\n'}
              • Request deletion of your data{'\n'}
              • Opt-out of certain data collection{'\n'}
              • Export your data{'\n'}
              • Withdraw consent at any time
            </Text>
          </View>

          {/* Location Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Services</Text>
            <Text style={styles.paragraph}>
              Our app may request access to your location to provide map features and location-based services. 
              You can control location permissions through your device settings. 
              Location data is used only for app functionality and is not shared with third parties.
            </Text>
          </View>

          {/* Camera and Photos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Camera and Photo Access</Text>
            <Text style={styles.paragraph}>
              The app may request camera and photo library access to enable photo capture and virtual tour creation. 
              Photos are stored locally on your device and optionally uploaded to our secure servers. 
              You can revoke camera permissions at any time through device settings.
            </Text>
          </View>

          {/* Children's Privacy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Our app is not intended for children under 13 years of age. 
              We do not knowingly collect personal information from children under 13. 
              If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately.
            </Text>
          </View>

          {/* Changes to Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Changes to This Policy</Text>
            <Text style={styles.paragraph}>
              We may update this privacy policy from time to time. 
              We will notify you of any changes by posting the new policy in the app and updating the "Last Updated" date. 
              Your continued use of the app after changes constitutes acceptance of the updated policy.
            </Text>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this privacy policy or our data practices, please contact us:{'\n\n'}
              Email: privacy@BirCube.com{'\n'}
              Address: BirCube{'\n'}
              Phone: +092 3453453453
            </Text>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
    textAlign: 'justify',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default PrivacyPolicy;
