// utils/pdf.helper.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const generateCertificatePDF = async (
  certificate: {
    userName?: string;
    courseTitle?: string;
    issueDate?: string;
    certificateCode?: string;
  }
) => {
  const html = `
    <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Georgia', serif;
        background-color: #fff;
      }

      .certificate {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 40px auto;
        padding: 60px 40px;
        background: #fff;
        border: 10px solid #e5e7eb;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
      }

      .ribbon {
        position: absolute;
        top: -10px;
        left: -10px;
        width: 150px;
      }

      .seal {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 100px;
      }

      h1 {
        text-align: center;
        font-size: 32px;
        margin-top: 30px;
        letter-spacing: 2px;
      }

      .recipient {
        text-align: center;
        font-size: 26px;
        margin: 20px 0;
        color: #dc2626;
        font-family: 'Courier New', cursive;
      }

      .text-block {
        text-align: center;
        font-size: 16px;
        margin: 10px auto 30px;
        width: 80%;
        line-height: 1.6;
        color: #1f2937;
      }

      .info {
        text-align: center;
        font-size: 18px;
        margin: 10px 0;
      }

      .signatures {
        display: flex;
        justify-content: space-between;
        margin-top: 50px;
        padding: 0 30px;
      }

      .signatures div {
        border-top: 1px solid #000;
        width: 40%;
        text-align: center;
        padding-top: 6px;
        font-size: 14px;
      }

      .footer {
        text-align: center;
        font-size: 14px;
        color: #6b7280;
        margin-top: 40px;
      }
    </style>
  </head>
  <body>
    <div class="certificate">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrYZpImWkkvgBA43_ERrSsZADWxAKbqYbWtA&s" class="ribbon" />
      <img src="https://media.istockphoto.com/id/172901563/photo/golden-seal.jpg?s=612x612&w=0&k=20&c=A6hfDeIRKZiV6tt_erG_03SlSCBBPnk5jrwAw_4CGcQ=" class="seal" />
      
      <h1>CERTIFICAT D’APPRÉCIATION</h1>
      <div class="recipient">${certificate.userName || 'Prénom Nom'}</div>
      
      <div class="text-block">
        En remerciement pour sa participation et son soutien lors de l’événement du<br />
        <strong>${new Date(certificate.issueDate || '').toLocaleDateString() || '21 Octobre 2021'}</strong>
      </div>

      <div class="info"><strong>Formation :</strong> ${certificate.courseTitle || 'Formation inconnue'}</div>
      <div class="info"><strong>Code Certificat :</strong> ${certificate.certificateCode || '---'}</div>

      <div class="signatures">
        <div>Date</div>
        <div>Signature, Directeur</div>
      </div>

      <div class="footer">Plasturgie-Nous Academy - Certificat numérique</div>
    </div>
  </body>
</html>


  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Succès", "Certificat généré à : " + uri);
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Erreur", "Impossible de générer le certificat.");
  }
};
