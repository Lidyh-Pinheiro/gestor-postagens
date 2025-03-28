
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Facebook, Send, Copy, Download, Printer, Eye } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalendarEntry from '@/components/CalendarEntry';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string | null;
  posts?: any[];
}

interface CalendarPost {
  id: number;
  date: string;
  day: string;
  dayOfWeek: string;
  title: string;
  type: string;
  postType: string;
  text: string;
  completed?: boolean;
  notes?: string;
  images?: string[];
  clientId?: string;
  socialNetworks?: string[];
}

const ShareModal: React.FC<ShareModalProps> = ({ open, onOpenChange, clientId, posts = [] }) => {
  const { settings, generateClientShareLink } = useSettings();
  const [activeTab, setActiveTab] = useState<string>("link");
  const printableAreaRef = useRef<HTMLDivElement>(null);
  const [clientPosts, setClientPosts] = useState<CalendarPost[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const client = clientId 
    ? settings.clients.find(c => c.id === clientId) 
    : null;
  
  if (!client) return null;
  
  const themeColor = client ? client.themeColor : "#dc2626";
  const shareLink = generateClientShareLink(client.id);
  
  // Load posts from localStorage for this client
  useEffect(() => {
    if (clientId) {
      const storedPosts = localStorage.getItem('calendarPosts');
      if (storedPosts) {
        const allPosts = JSON.parse(storedPosts);
        const filteredPosts = allPosts.filter((post: CalendarPost) => post.clientId === clientId);
        setClientPosts(filteredPosts);
      }
    }
  }, [clientId, open]);
  
  // Generate image when opening preview tab
  useEffect(() => {
    if (activeTab === "preview" && open && printableAreaRef.current && !generatedImage) {
      generateImage();
    }
  }, [activeTab, open]);
  
  const generateImage = async () => {
    if (!printableAreaRef.current) return;
    
    try {
      const canvas = await html2canvas(printableAreaRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF'
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    }
  };
  
  const shareViaWhatsApp = () => {
    if (generatedImage && activeTab === "preview") {
      // Create a temporary anchor to download the image
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `agenda_${client.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      a.click();
      
      toast.success('Imagem salva para compartilhamento via WhatsApp');
    } else {
      const whatsappUrl = `https://wa.me/?text=Confira a agenda de postagens de ${client.name}: ${shareLink}`;
      window.open(whatsappUrl, '_blank');
      toast.success('Link preparado para compartilhar via WhatsApp');
    }
  };
  
  const shareViaFacebook = () => {
    if (generatedImage && activeTab === "preview") {
      // Create a temporary anchor to download the image
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `agenda_${client.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      a.click();
      
      toast.success('Imagem salva para compartilhamento via Facebook');
    } else {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=Confira a agenda de postagens de ${client.name}`;
      window.open(facebookUrl, '_blank');
      toast.success('Link preparado para compartilhar via Facebook');
    }
  };
  
  const shareViaEmail = () => {
    if (generatedImage && activeTab === "preview") {
      // Create a temporary anchor to download the image
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `agenda_${client.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      a.click();
      
      toast.success('Imagem salva para compartilhamento via email');
    } else {
      const subject = `Agenda de Postagens de ${client.name}`;
      const body = `Olá,\n\nGostaria de compartilhar a agenda de postagens de ${client.name}.\n\nAcesse: ${shareLink}\n\nAtenciosamente,\n${settings.companyName}`;
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      toast.success('Preparado para enviar por email');
    }
  };
  
  const copyToClipboard = () => {
    if (generatedImage && activeTab === "preview") {
      // Create a temporary anchor to download the image
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = `agenda_${client.name.replace(/\s+/g, '_').toLowerCase()}.png`;
      a.click();
      
      toast.success('Imagem salva para compartilhamento');
    } else {
      navigator.clipboard.writeText(shareLink);
      toast.success('Link copiado para a área de transferência');
    }
  };
  
  const printContent = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Bloqueador de pop-up impediu a impressão. Por favor, desabilite-o e tente novamente.');
      return;
    }

    const printableArea = printableAreaRef.current;
    if (!printableArea) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Agenda de ${client.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              max-width: 1200px; 
              margin: 0 auto; 
              color: #333;
              background-color: #f9f9f9;
            }
            .agenda-header { 
              text-align: center; 
              margin-bottom: 40px; 
              padding-bottom: 20px;
              border-bottom: 1px solid #eaeaea;
            }
            .agenda-header h1 { 
              color: ${themeColor}; 
              font-size: 32px;
              margin-bottom: 8px;
              font-weight: 700;
            }
            .agenda-header h2 {
              font-size: 24px;
              margin-top: 0;
              margin-bottom: 10px;
              color: #333;
              font-weight: 600;
            }
            .agenda-header p {
              color: #666;
              margin-top: 0;
            }
            .card-container { 
              display: grid; 
              grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
              gap: 24px; 
            }
            .card { 
              border: 1px solid #e2e8f0; 
              border-radius: 12px; 
              padding: 24px; 
              margin-bottom: 24px; 
              box-shadow: 0 4px 10px rgba(0,0,0,0.05);
              background-color: white;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .card-date { 
              background-color: ${themeColor}; 
              color: white; 
              display: inline-block; 
              padding: 8px 16px; 
              border-radius: 20px; 
              font-weight: 700; 
              margin-bottom: 16px; 
              font-size: 14px;
            }
            .card-title { 
              font-size: 20px; 
              font-weight: 700; 
              margin-bottom: 12px; 
              color: #333;
            }
            .card-type { 
              background-color: #f1f5f9; 
              color: #64748b; 
              padding: 6px 12px; 
              border-radius: 12px; 
              display: inline-block; 
              font-size: 13px; 
              margin-bottom: 14px; 
              font-weight: 600;
            }
            .card-text { 
              white-space: pre-line; 
              color: #4b5563;
              line-height: 1.6;
              font-size: 15px;
            }
            .social-icons {
              display: flex;
              gap: 8px;
              margin-top: 16px;
            }
            .social-icon {
              background-color: #f1f5f9;
              color: #64748b;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .color-block {
              background-color: ${themeColor};
              color: white;
              font-weight: bold;
              padding: 8px 16px;
              border-radius: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #eaeaea;
              color: #666;
              font-size: 14px;
            }
            @media print {
              body {
                padding: 0;
                background-color: white;
              }
              .card-container {
                gap: 16px;
              }
              .card { 
                break-inside: avoid; 
                page-break-inside: avoid;
                box-shadow: none;
                border: 1px solid #eaeaea;
              }
              .page-break {
                page-break-after: always;
              }
            }
          </style>
        </head>
        <body>
          <div class="agenda-header">
            <h1>Agenda de Postagens</h1>
            <h2>${client.name}</h2>
            <p>${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div class="card-container">
            ${Array.from(printableArea.querySelectorAll('.agenda-card')).map((card, index) => {
              const cleanedCard = card.cloneNode(true) as HTMLElement;
              
              // Extract data from the card
              const dateEl = cleanedCard.querySelector('[style*="background-color"]');
              const titleEl = cleanedCard.querySelector('h3');
              const typeEl = cleanedCard.querySelector('.bg-gray-100.text-gray-700');
              const textEl = cleanedCard.querySelector('p.text-gray-700');
              const socialIconsEl = cleanedCard.querySelector('.mt-3.flex.items-center.space-x-2');
              
              // Remove any buttons or interactive elements
              const buttons = cleanedCard.querySelectorAll('button, .cursor-pointer');
              buttons.forEach(button => button.parentNode?.removeChild(button));
              
              const date = dateEl ? dateEl.textContent : '';
              const title = titleEl ? titleEl.textContent : '';
              const type = typeEl ? typeEl.textContent : '';
              const text = textEl ? textEl.textContent : '';
              
              return `
                <div class="card">
                  <div class="card-date">${date}</div>
                  <div class="card-title">${title}</div>
                  <div class="card-type">${type}</div>
                  <div class="card-text">${text}</div>
                  ${socialIconsEl ? `
                    <div class="social-icons">
                      ${Array.from(socialIconsEl.children).map(() => `
                        <div class="social-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${settings.companyName || 'Agenda de Postagens'}</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Compartilhar Agenda de {client.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="preview">Visualização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="p-4">
            <div className="mb-4 flex items-center gap-2 p-2 bg-gray-50 rounded border">
              <input 
                type="text" 
                readOnly 
                value={shareLink} 
                className="flex-1 bg-transparent border-0 focus:outline-none text-sm"
              />
              <Button 
                onClick={copyToClipboard} 
                variant="outline" 
                size="sm"
              >
                Copiar
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </Button>
              
              <Button 
                onClick={shareViaFacebook}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </Button>
              
              <Button 
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white"
                variant="outline"
              >
                <Send className="w-4 h-4" />
                Email
              </Button>
              
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar Link
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preview" className="pt-2">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Prévia da Agenda</h3>
              <div className="flex gap-2">
                <Button 
                  onClick={printContent}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Imprimir</span>
                </Button>
              </div>
            </div>
            
            <div 
              className="overflow-y-auto max-h-[500px] p-4 bg-white border rounded-md"
              style={{ minHeight: '280px' }}
            >
              <div ref={printableAreaRef} className="space-y-4">
                {clientPosts && clientPosts.length > 0 ? (
                  clientPosts.map((post, index) => (
                    <div key={post.id} className="agenda-card">
                      <CalendarEntry
                        date={post.date}
                        day={post.dayOfWeek}
                        title={post.title}
                        type={post.postType}
                        text={post.text}
                        highlighted={true}
                        themeColor={themeColor}
                        completed={post.completed}
                        socialNetworks={post.socialNetworks}
                        preview={true}
                        hideIcons={true}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma postagem disponível para visualização
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
              >
                <MessageSquare className="w-4 h-4" />
                Compartilhar
              </Button>
              
              <Button 
                onClick={shareViaFacebook}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Facebook className="w-4 h-4" />
                Postar
              </Button>
              
              <Button 
                onClick={shareViaEmail}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white"
                variant="outline"
              >
                <Send className="w-4 h-4" />
                Enviar
              </Button>
              
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-center mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
