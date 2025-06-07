
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  MessageSquare, 
  Download,
  ExternalLink,
  Book,
  Users
} from "lucide-react";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    question: "ขั้นตอนการขอใบรับรอง GAP สมุนไพรมีอย่างไร?",
    answer: "1. ยื่นคำขอพร้อมเอกสาร 2. ตรวจประเมินแปลงปลูก 3. ตรวจสอบเอกสาร 4. ออกใบรับรอง หากผ่านเกณฑ์",
    category: "การรับรอง"
  },
  {
    id: "2",
    question: "ระบบ Traceability ช่วยเกษตรกรอย่างไร?",
    answer: "ช่วยติดตามการผลิตตั้งแต่เมื่อถึงผู้บริโภค เพิ่มความน่าเชื่อถือและมูลค่าสินค้า รวมถึงช่วยในการจัดการคุณภาพ",
    category: "ระบบติดตาม"
  },
  {
    id: "3",
    question: "การขึ้นทะเบียนผู้ผลิตสมุนไพรต้องใช้เอกสารอะไรบ้าง?",
    answer: "บัตรประชาชน หนังสือรับรองแปลงปลูก ใบรับรอง GAP (ถ้ามี) แผนที่แปลงปลูก และเอกสารประกอบอื่นๆ",
    category: "การลงทะเบียน"
  }
];

export default function SupportView() {
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "ทั่วไป"
  });

  const categories = ["ทั้งหมด", "การรับรอง", "ระบบติดตาม", "การลงทะเบียน", "เทคนิค"];

  const filteredFAQ = selectedCategory === "ทั้งหมด" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support form submitted:", supportForm);
    // Reset form
    setSupportForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "ทั่วไป"
    });
  };

  return (
    <HerbTraceLayout activeTab="support">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ศูนย์ช่วยเหลือ</h1>
            <p className="text-muted-foreground">
              ข้อมูลและการสนับสนุนสำหรับระบบผลิตสมุนไพรไทย
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-green-600" />
                โทรศัพท์
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">02-590-1234</p>
                <p className="text-sm text-muted-foreground">สายด่วนกรมแพทย์แผนไทยฯ</p>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>จ.-ศ. 8:30-16:30</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                อีเมล
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">support@herbtrace.go.th</p>
                <p className="text-sm text-muted-foreground">ฝ่ายสนับสนุนระบบ</p>
                <p className="text-sm text-muted-foreground">ตอบกลับภายใน 24 ชม.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-red-600" />
                ที่อยู่
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">กรมการแพทย์แผนไทยและการแพทย์ทางเลือก</p>
                <p className="text-sm text-muted-foreground">กระทรวงสาธารณสุข</p>
                <p className="text-sm text-muted-foreground">ถ.ติวานนท์ นนทบุรี</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-purple-600" />
                ชุมชนผู้ใช้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Facebook Group
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Line Official
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  คำถามที่พบบ่อย (FAQ)
                </CardTitle>
                <CardDescription>
                  คำตอบสำหรับคำถามยอดนิยมเกี่ยวกับระบบสมุนไพร
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQ.map((faq) => (
                    <div key={faq.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{faq.question}</h4>
                      <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      <Badge variant="outline" className="mt-2">
                        {faq.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  ส่งคำถาม
                </CardTitle>
                <CardDescription>
                  ไม่พบคำตอบ? ส่งคำถามมาให้เรา
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                    <Input
                      id="name"
                      value={supportForm.name}
                      onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      type="email"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">หัวข้อ</Label>
                    <Input
                      id="subject"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">รายละเอียด</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    ส่งคำถาม
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  เอกสารดาวน์โหลด
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  คู่มือการใช้งานระบบ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  แบบฟอร์มขอใบรับรอง GAP
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  มาตรฐานสมุนไพรไทย
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Book className="mr-2 h-4 w-4" />
                  คู่มือเกษตรกร
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </HerbTraceLayout>
  );
}
