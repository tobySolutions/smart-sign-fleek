import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed
// Font.register({
//   family: 'Inter',
//   src: '/fonts/Inter-Regular.ttf'
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  parties: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  partyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  partyInfo: {
    marginBottom: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    lineHeight: 1.6,
  },
  signatures: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature: {
    width: '45%',
  },
  signatureLine: {
    borderTop: '1px solid black',
    marginTop: 40,
    marginBottom: 8,
  },
});

export const ContractPDF = ({ contract }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{contract.title}</Text>
        <Text style={styles.date}>Effective Date: {contract.effectiveDate}</Text>
      </View>

      {/* Parties */}
      <View style={styles.parties}>
        <Text style={styles.partyTitle}>Parties</Text>
        <View style={styles.partyInfo}>
          <Text>First Party: {contract.parties.party1.name}</Text>
          <Text>Role: {contract.parties.party1.role}</Text>
        </View>
        <View style={styles.partyInfo}>
          <Text>Second Party: {contract.parties.party2.name}</Text>
          <Text>Role: {contract.parties.party2.role}</Text>
        </View>
      </View>

      {/* Sections */}
      {contract.sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.content}>{section.content}</Text>
        </View>
      ))}

      {/* Termination */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Termination</Text>
        <Text style={styles.content}>{contract.termination}</Text>
      </View>

      {/* Signatures */}
      <View style={styles.signatures}>
        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text>{contract.signatures.party1.name}</Text>
          <Text>{contract.signatures.party1.title}</Text>
          <Text>Date: {contract.signatures.party1.date}</Text>
        </View>
        <View style={styles.signature}>
          <View style={styles.signatureLine} />
          <Text>{contract.signatures.party2.name}</Text>
          <Text>{contract.signatures.party2.title}</Text>
          <Text>Date: {contract.signatures.party2.date}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
