import ContactContent from "@/components/ContactContent";

export const metadata = {
  title: "Contact | Aswin Krishna Photography Toronto",
  description:
    "Get in touch with Aswin Krishna for weddings, nature, and portrait sessions in Toronto and Ontario.",
};

export default function ContactPage() {
  return (
    <main
      id="main"
      className="pt-28 pb-20 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full min-h-svh"
    >
      <ContactContent />
    </main>
  );
}
