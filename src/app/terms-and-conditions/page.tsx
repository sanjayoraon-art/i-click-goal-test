
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.2]">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg rounded-2xl border">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary text-center">
                  Terms and Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <h2 className="text-xl font-semibold text-foreground pt-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using our Click Speed Test website, you accept and agree to be bound by the terms and provision of this agreement.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">2. Use of the Website</h2>
                <p>
                  This website is provided for personal, non-commercial use. You agree to use this site for lawful purposes only. You are prohibited from using the site to post or transmit any material which is or may be infringing, threatening, false, misleading, inflammatory, libelous, invasive of privacy, obscene, pornographic, abusive, discriminating, illegal or any material that could constitute or encourage conduct that would be considered a criminal offence, violate the rights of any party or which may otherwise give rise to civil liability or violate any law.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">3. Disclaimers</h2>
                <p>
                  The service is provided "as is". We make no warranty or representation that the website will meet your requirements, that it will be of satisfactory quality, that it will be fit for a particular purpose, that it will not infringe the rights of third parties, that it will be compatible with all systems, that it will be secure and that all information provided will be accurate. We make no guarantee of any specific results from the use of our services.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">4. Limitation of Liability</h2>
                <p>
                  We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the website.
                </p>

                <h2 className="text-xl font-semibold text-foreground pt-4">5. Changes to the Terms</h2>
                <p>
                  We reserve the right to make changes to these Terms and Conditions at any time. Your use of the site following the posting of any changes will be deemed to be your acceptance of such changes.
                </p>
              </CardContent>
            </Card>
            <div className="text-center mt-8">
              <Link href="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
      <footer className="w-full bg-card/80 backdrop-blur-sm p-4 text-center text-muted-foreground">
          <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span>&copy; {new Date().getFullYear()} Click Speed Test. All rights reserved.</span>
              <div className="flex space-x-4">
                <Link href="/about" className="hover:text-primary">About Us</Link>
                <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="hover:text-primary">Terms & Conditions</Link>
              </div>
          </div>
      </footer>
    </>
  );
}
