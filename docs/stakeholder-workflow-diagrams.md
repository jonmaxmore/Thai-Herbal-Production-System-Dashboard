
# Stakeholder Workflow Diagrams - Hand Draft Style

## 📊 Visual Workflow Representations

---

## 1. เกษตรกร (Farmer) - Detailed Workflow

```
     [เกษตรกร]
         │
    ┌────▼────┐
    │ ลงทะเบียน │
    │ ในระบบ   │
    └────┬────┘
         │
    ┌────▼────┐
    │ ข้อมูล   │
    │ ฟาร์ม    │
    └────┬────┘
         │
    ┌────▼────┐
    │ จดทะเบียน│
    │ พืชผล   │
    └────┬────┘
         │
    ┌────▼────┐
    │ QR Code │◄──── [🤖 AI Generate]
    │ เมล็ดพันธุ์│
    └────┬────┘
         │
    ┌────▼────┐
    │ ติดตาม  │◄──── [📸 ถ่ายภาพ]
    │ การเจริญ │      [🤖 AI Analysis]
    └────┬────┘
         │
    ┌────▼────┐
    │ บันทึก  │
    │ การดูแล │
    └────┬────┘
         │
    ┌────▼────┐
    │ เก็บเกี่ยว│◄──── [⚖️ ชั่งน้ำหนัก]
    │ ผลผลิต  │      [🤖 AI Quality]
    └────┬────┘
         │
    ┌────▼────┐
    │ ยื่นขอ   │
    │ GACP    │
    └────┬────┘
         │
    ┌────▼────┐
    │ รอการ   │◄──── [📞 Video Call]
    │ ตรวจสอบ │      [🚗 Site Visit]
    └────┬────┘
         │
    ┌────▼────┐
    │ รับใบ   │
    │ รับรอง  │
    └─────────┘
```

---

## 2. กรมการแพทย์แผนไทยฯ (DTTM) - Process Flow

```
     [DTTM Officer]
          │
     ┌────▼────┐
     │ รับใบ   │◄──── [📨 Notification]
     │ สมัคร   │
     └────┬────┘
          │
     ┌────▼────┐
     │ ตรวจสอบ │◄──── [🤖 AI Pre-screen]
     │ เอกสาร  │      [📊 Risk Score]
     └────┬────┘
          │
     ┌────▼────┐         ❌ ไม่ผ่าน
     │ ประเมิน  │────────────┐
     │ ความพร้อม│            │
     └────┬────┘            │
          │ ✅ ผ่าน          │
     ┌────▼────┐            │
     │ มอบหมาย │            │
     │ ผู้ตรวจ  │            │
     └────┬────┘            │
          │                │
     ┌────▼────┐            │
     │ Video   │            │
     │ Call    │            │
     └────┬────┘            │
          │                │
     ┌────▼────┐            │
     │ Site    │            │
     │ Visit   │            │
     └────┬────┘            │
          │                │
     ┌────▼────┐            │
     │ ประเมิน  │            │
     │ ผลลัพธ์  │            │
     └────┬────┘            │
          │                │
      ┌───▼───┐             │
      │ ผ่าน? │             │
      └───┬───┘             │
    ✅ ผ่าน │ ❌ ไม่ผ่าน      │
    ┌────▼────┐         ┌───▼───┐
    │ ออกใบ   │         │ แจ้ง   │
    │ รับรอง  │         │ ปรับปรุง│
    └─────────┘         └───────┘
```

---

## 3. บริษัท AI (Predictive AI Solutions) - AI Service Flow

```
     [AI System]
          │
     ┌────▼────┐
     │ รับข้อมูล│◄──── [📸 Images]
     │ จากระบบ │      [📝 Documents]
     └────┬────┘      [📊 Data]
          │
     ┌────▼────┐
     │ Pre-    │
     │ Process │
     └────┬────┘
          │
    ┌─────▼─────┐
    │ AI Engine │
    │  Analysis │
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │ Computer  │◄──── [🔍 Image Recognition]
    │ Vision    │      [🌱 Plant Health]
    └─────┬─────┘      [🦠 Disease Detection]
          │
    ┌─────▼─────┐
    │ Quality   │◄──── [⭐ Grade A/B/C]
    │ Assessment│      [💰 Price Estimate]
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │ Predictive│◄──── [📈 Yield Forecast]
    │ Analytics │      [⏰ Harvest Time]
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │ Results   │
    │ Package   │
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │ API       │────► [📱 Mobile App]
    │ Response  │      [🌐 Web Portal]
    └───────────┘      [📊 Dashboard]
```

---

## 4. การทำงานร่วมกันของทุก Stakeholders

```
[เกษตรกร] ◄──┐                    ┌──► [ผู้ผลิต]
     │        │                    │         │
     ▼        │    [แพลตฟอร์มกลาง]   │         ▼
┌─────────┐   │         │          │   ┌─────────┐
│ข้อมูลฟาร์ม│  │         ▼          │   │ข้อมูลการ │
│และพืชผล │  │   ┌──────────────┐   │   │แปรรูป   │
└─────────┘   │   │  🔄 Data     │   │   └─────────┘
              │   │   Sync Hub   │   │
[DTTM] ◄──────┘   │              │   └──► [Lab]
     │            │  📊 Dashboard │           │
     ▼            │              │           ▼
┌─────────┐       │  🤖 AI Core  │     ┌─────────┐
│การรับรอง │       │              │     │ผลการ   │
│มาตรฐาน  │       │  🔐 Security │     │ทดสอบ   │
└─────────┘       │              │     └─────────┘
              │   │  ⛓️ Blockchain│   │
[AI Company]◄──   │              │   └──► [ผู้บริโภค]
     │            └──────────────┘           │
     ▼                    │                 ▼
┌─────────┐              │           ┌─────────┐
│AI Models│              │           │ข้อมูล   │
│& Analytics│            │           │ย้อนกลับ │
└─────────┘              │           └─────────┘
                         │
                    [Regulator] ◄────┘
                         │
                         ▼
                   ┌─────────┐
                   │นโยบาย   │
                   │และกฎหมาย│
                   └─────────┘
```

---

## 5. Data Flow Timeline - จากเมล็ดถึงผู้บริโภค

```
Timeline: 0 ────► 3m ────► 6m ────► 9m ────► 12m ────► Market

เมล็ดพันธุ์     ปลูก        ดูแล        เก็บเกี่ยว      แปรรูป      ผู้บริโภค
    │           │           │            │             │           │
    ▼           ▼           ▼            ▼             ▼           ▼
┌───────┐   ┌───────┐   ┌───────┐    ┌───────┐    ┌───────┐   ┌───────┐
│QR-001 │──►│QR-002 │──►│QR-003 │───►│QR-004 │───►│QR-005 │──►│QR-006 │
│Seed   │   │Plant  │   │Care   │    │Harvest│    │Process│   │Product│
└───┬───┘   └───┬───┘   └───┬───┘    └───┬───┘    └───┬───┘   └───┬───┘
    │           │           │            │            │           │
    ▼           ▼           ▼            ▼            ▼           ▼
📊 Supplier  📊 Growth   📊 Treatment  📊 Quality   📊 Manufact. 📊 Consumer
   Data        Data        Data         Data         Data        Feedback

🤖 AI Analysis Points:
   - Seed Quality ─────► Plant Health ─────► Disease Detection
   - Growth Prediction ─────► Yield Forecast ─────► Quality Grade
   - Treatment Effectiveness ─────► Harvest Timing ─────► Final Assessment

🔐 Blockchain Records:
   [Block-1] ──► [Block-2] ──► [Block-3] ──► [Block-4] ──► [Block-5] ──► [Block-6]
   Immutable chain of custody and quality records
```

---

## 6. Communication Flow Between Stakeholders

```
                     📱 Mobile/Web Interface
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    ┌───▼───┐         ┌───▼───┐         ┌───▼───┐
    │เกษตรกร│         │ DTTM  │         │ AI Co.│
    └───┬───┘         └───┬───┘         └───┬───┘
        │                 │                 │
        │    📋 Application│                 │
        └─────────────────►│                 │
        │                 │                 │
        │                 │🤖 AI Analysis   │
        │                 │◄────────────────┘
        │                 │                 │
        │    📞 Video Call │                 │
        │◄─────────────────┤                 │
        │                 │                 │
        │    🚗 Site Visit │                 │
        │◄─────────────────┤                 │
        │                 │                 │
        │    📜 Certificate│                 │
        │◄─────────────────┤                 │
        │                 │                 │
        │                 │    📊 Feedback  │
        │                 └─────────────────►│
        │                                   │
        │         🔄 Continuous Learning    │
        └───────────────────────────────────►│

    💬 Real-time Notifications:
    ├── 📨 Email alerts
    ├── 📱 Push notifications  
    ├── 🔔 In-app messages
    └── 📞 SMS alerts

    📊 Shared Dashboard Views:
    ├── 👨‍🌾 Farmer: การติดตามสถานะใบสมัคร
    ├── 👨‍💼 DTTM: คิวงานที่ต้องตรวจสอบ
    ├── 🤖 AI: Performance metrics และ feedback
    └── 👥 All: ภาพรวมของระบบทั้งหมด
```

---

## 7. Emergency/Exception Handling Flow

```
                    ⚠️ Exception Detection
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    Plant Disease      Document Fraud     System Failure
        │                  │                  │
        ▼                  ▼                  ▼
    🚨 AI Alert       🚨 AI Detection    🚨 Auto Failover
        │                  │                  │
        ▼                  ▼                  ▼
    📱 Notify Farmer   📱 Notify DTTM     📱 Notify Admin
        │                  │                  │
        ▼                  ▼                  ▼
    🔍 Expert Review   🔍 Manual Review   🔧 System Recovery
        │                  │                  │
        ▼                  ▼                  ▼
    💊 Treatment Plan  ❌ Reject App.     ✅ Service Restored
        │                  │                  │
        ▼                  ▼                  ▼
    📊 Track Recovery  📝 Fraud Report    📊 Incident Report

    🔄 Feedback Loop:
    All exceptions fed back to AI for continuous learning
    and improved detection capabilities
```

---

## 8. Quality Assurance Flow

```
    🎯 Quality Gate 1: Data Input
            │
    ┌───────▼───────┐
    │ Field Validation│
    │ Format Check   │
    │ Completeness   │
    └───────┬───────┘
            │
    🎯 Quality Gate 2: AI Analysis
            │
    ┌───────▼───────┐
    │ Model Accuracy │
    │ Confidence Score│
    │ Anomaly Check  │
    └───────┬───────┘
            │
    🎯 Quality Gate 3: Human Review
            │
    ┌───────▼───────┐
    │ Expert Opinion │
    │ Cross-reference│
    │ Final Decision │
    └───────┬───────┘
            │
    🎯 Quality Gate 4: Blockchain
            │
    ┌───────▼───────┐
    │ Immutable Log  │
    │ Hash Verification│
    │ Consensus      │
    └───────┬───────┘
            │
    📊 Quality Metrics Dashboard
```

---

## 9. Mobile vs Web Interface Flow

```
    📱 Mobile First Experience        🌐 Web Advanced Features
           │                                │
    ┌──────▼──────┐                 ┌──────▼──────┐
    │ Quick Actions│                 │ Full Dashboard│
    │ • QR Scan    │                 │ • Analytics   │
    │ • Photo Cap. │                 │ • Reports     │
    │ • Notifications│               │ • Admin Tools │
    │ • Basic Info │                 │ • Data Export │
    └──────┬──────┘                 └──────┬──────┘
           │                                │
    ┌──────▼──────┐                 ┌──────▼──────┐
    │ Offline Mode │                 │ Real-time   │
    │ • Local Cache│                 │ • Live Data  │
    │ • Sync Later │                 │ • Collaboration│
    │ • Essential  │                 │ • Multi-user │
    └──────┬──────┘                 └──────┬──────┘
           │                                │
           └────────┬─────────────────────┘
                    │
            ┌──────▼──────┐
            │ Unified API  │
            │ • Consistent │
            │ • Responsive │
            │ • Accessible │
            └─────────────┘
```

เอกสารเหล่านี้แสดงให้เห็นการทำงานของระบบอย่างครอบคลุม ตั้งแต่ระดับ architecture จนถึงการไหลของข้อมูลระหว่าง stakeholders ทั้งหมด
