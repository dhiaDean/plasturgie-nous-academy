
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-sm font-semibold text-tunisiaTeal-500 uppercase tracking-wider">
                Contactez-nous
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-tunisiaBlue-800 mt-2">
                Nous sommes à votre écoute
              </h1>
              <div className="h-1 w-24 bg-tunisiaTeal-400 mt-4 mb-6 mx-auto"></div>
              <p className="text-gray-600 text-lg">
                Besoin d'informations sur nos formations ou nos services ? N'hésitez pas à nous contacter. Notre équipe se fera un plaisir de vous répondre dans les plus brefs délais.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-tunisiaBlue-800 mb-8 text-center">
                Où nous trouver
              </h2>
              
              <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.8906283245696!2d10.188821776534462!3d36.89826497227395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb7eae164a79%3A0x91ddef7ec9c4d1d2!2sTechnopole%20El%20Ghazala!5e0!3m2!1sfr!2stn!4v1690032146389!5m2!1sfr!2stn" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tunisia Formation Map Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Contact;
