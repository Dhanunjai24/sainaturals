import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme colors
    COLOR_BG_DARK = RGBColor(15, 23, 42)       # Slate 900
    COLOR_BG_CARD = RGBColor(30, 41, 59)       # Slate 800
    COLOR_CARD_BORDER = RGBColor(51, 65, 85)   # Slate 700
    COLOR_EMERALD = RGBColor(16, 185, 129)     # Emerald 500
    COLOR_EMERALD_DARK = RGBColor(5, 150, 105) # Emerald 600
    COLOR_AMBER = RGBColor(245, 158, 11)       # Amber 500
    COLOR_TEXT_LIGHT = RGBColor(248, 250, 252) # Slate 50
    COLOR_TEXT_MUTED = RGBColor(148, 163, 184) # Slate 400
    COLOR_WHITE = RGBColor(255, 255, 255)

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG_DARK
        bg.line.color.rgb = COLOR_BG_DARK
        return bg

    def add_header(slide, tag, title, subtitle=None):
        # Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = COLOR_EMERALD
        p_tag.font.name = "Arial"

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_LIGHT
        p_title.font.name = "Arial"

        if subtitle:
            p_sub = tb_title.text_frame.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = COLOR_TEXT_MUTED
            p_sub.font.name = "Arial"

    # ==============================================================
    # SLIDE 1: TITLE / COVER SLIDE
    # ==============================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)

    # Accent bar
    accent = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.15), Inches(3.2))
    accent.fill.solid()
    accent.fill.fore_color.rgb = COLOR_EMERALD
    accent.line.color.rgb = COLOR_EMERALD

    # Title box
    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.6), Inches(11.0), Inches(3.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "PROPRIETARY QUICK-COMMERCE & E-COMMERCE PLATFORM"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_EMERALD
    p0.font.name = "Arial"

    p1 = tf.add_paragraph()
    p1.text = "Sri Sai Natural Foods"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_LIGHT
    p1.font.name = "Arial"

    p2 = tf.add_paragraph()
    p2.text = "Commercial Product Acquisition & Turnkey Solution Pitch Deck"
    p2.font.size = Pt(20)
    p2.font.color.rgb = COLOR_TEXT_MUTED
    p2.font.name = "Arial"

    # Stat Badges at bottom
    badges = [
        ("25 Pages & Modules", "Customer Storefront + Admin ERP"),
        ("0% Marketplace Cuts", "Save 15-30% on Zepto/Swiggy fees"),
        ("Mobile Ready (Android)", "Built-in Capacitor wrapper"),
        ("Turnkey Architecture", "PostgreSQL + Instant Demo Engine")
    ]
    for i, (b_title, b_sub) in enumerate(badges):
        x = Inches(0.8 + i * 2.95)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(5.2), Inches(2.8), Inches(1.4))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        ctb = s1.shapes.add_textbox(x, Inches(5.3), Inches(2.8), Inches(1.2))
        ctf = ctb.text_frame
        ctf.word_wrap = True
        cp1 = ctf.paragraphs[0]
        cp1.text = b_title
        cp1.font.size = Pt(15)
        cp1.font.bold = True
        cp1.font.color.rgb = COLOR_EMERALD
        cp1.font.name = "Arial"

        cp2 = ctf.add_paragraph()
        cp2.text = b_sub
        cp2.font.size = Pt(11)
        cp2.font.color.rgb = COLOR_TEXT_MUTED
        cp2.font.name = "Arial"

    # ==============================================================
    # SLIDE 2: THE BUSINESS PROBLEM & OPPORTUNITY
    # ==============================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "Executive Problem & Market Opportunity", "Why Own Your Own Quick-Commerce Platform?", "The hidden costs of third-party aggregator dependency vs. direct-to-consumer ownership")

    cards_s2 = [
        ("The Problem: Aggregator Traps", "High Commissions (15-30%)", "Platforms like Swiggy, Zomato, and Blinkit eat 1/4th of every order value.", "Zero Customer Ownership", "Aggregators hide customer phone numbers, preventing direct repeat remarketing.", "Rent vs. Own", "You spend Lakhs building someone else's brand, not your own asset.", RGBColor(239, 68, 68)),
        ("The Solution: Your Own System", "0% Order Commissions", "Keep 100% of revenue directly in your bank account via UPI & COD.", "Full Customer CRM", "Build your direct database of loyal local Hyderabad / Telangana buyers.", "Turnkey Brand Equity", "A custom branded website + Android app that permanently builds your valuation.", COLOR_EMERALD)
    ]

    for i, (col_head, p1_h, p1_b, p2_h, p2_b, p3_h, p3_b, accent_col) in enumerate(cards_s2):
        x = Inches(0.8 + i * 5.95)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(5.75), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        tb = s2.shapes.add_textbox(x + Inches(0.3), Inches(2.2), Inches(5.15), Inches(4.3))
        tf = tb.text_frame
        tf.word_wrap = True

        h = tf.paragraphs[0]
        h.text = col_head
        h.font.size = Pt(20)
        h.font.bold = True
        h.font.color.rgb = accent_col
        h.font.name = "Arial"

        points = [(p1_h, p1_b), (p2_h, p2_b), (p3_h, p3_b)]
        for pt_h, pt_b in points:
            ph = tf.add_paragraph()
            ph.space_before = Pt(14)
            ph.text = f"• {pt_h}"
            ph.font.size = Pt(14)
            ph.font.bold = True
            ph.font.color.rgb = COLOR_TEXT_LIGHT
            ph.font.name = "Arial"

            pb = tf.add_paragraph()
            pb.text = f"   {pt_b}"
            pb.font.size = Pt(12)
            pb.font.color.rgb = COLOR_TEXT_MUTED
            pb.font.name = "Arial"

    # ==============================================================
    # SLIDE 3: COMPLETE PLATFORM ARCHITECTURE
    # ==============================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Architecture & Technical Stack", "Full-Stack Enterprise Technology Blueprint", "Engineered for lightning speed, zero crashes, and zero vendor lock-in")

    tech_blocks = [
        ("Customer Storefront", "React 18 + TypeScript + Vite", ["15 Completed high-conversion pages", "Tailwind CSS modern responsive design", "Audited & tested down to 320px mobile viewports", "Telugu & English bilingual product titles"]),
        ("Admin ERP Suite", "Enterprise Management Portal", ["10 Integrated operational business modules", "Live order status transition pipeline", "Inventory audit logs with reason recording", "Coupon engine & sales revenue analytics"]),
        ("Backend REST API", "Node.js + Express REST Engine", ["Clean modular MVC architecture", "Bcrypt password hashing + JWT auth", "ACID stock deduction & cancellation restoral", "Dynamic UPI QR payment generator"]),
        ("Dual-Mode Database", "PostgreSQL + Instant Fallback", ["13 Normalized relational SQL tables", "Zero-config embedded local JSON engine", "Easy 1-click cloud deploy to Neon/Supabase", "Zero ongoing software license fees"])
    ]

    for i, (title, sub, bullets) in enumerate(tech_blocks):
        x = Inches(0.8 + i * 2.95)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(2.8), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        tb = s3.shapes.add_textbox(x + Inches(0.2), Inches(2.2), Inches(2.4), Inches(4.3))
        tf = tb.text_frame
        tf.word_wrap = True

        h = tf.paragraphs[0]
        h.text = title
        h.font.size = Pt(16)
        h.font.bold = True
        h.font.color.rgb = COLOR_EMERALD
        h.font.name = "Arial"

        s = tf.add_paragraph()
        s.text = sub
        s.font.size = Pt(11)
        s.font.bold = True
        s.font.color.rgb = COLOR_AMBER
        s.font.name = "Arial"

        for b in bullets:
            bp = tf.add_paragraph()
            bp.space_before = Pt(10)
            bp.text = f"✔ {b}"
            bp.font.size = Pt(11)
            bp.font.color.rgb = COLOR_TEXT_LIGHT
            bp.font.name = "Arial"

    # ==============================================================
    # SLIDE 4: CUSTOMER STOREFRONT BREAKDOWN (15 PAGES)
    # ==============================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "Customer Facing Storefront", "15 Completed High-Conversion Store Pages", "Crafted specifically for local grocery, wood-pressed oils, and organic food commerce")

    pages_list = [
        ("Home Page", "Promotional hero banners, category shortcuts, featured items, local trust signals, 4.9 rating"),
        ("Catalog & Search", "Instant real-time search, category chip filters, price and rating sorting"),
        ("Product Details", "Bilingual Telugu/English titles, discount calculator, unit badges, customer reviews"),
        ("Smart Cart", "Quantity steppers, subtotal & free delivery threshold calculator, coupon promo box"),
        ("Express Checkout", "GPS Auto-Fill, address book selector, delivery slot picker, UPI QR & COD"),
        ("Live Order Tracking", "5-stage visual connected status stepper, 1-click cancellation with stock auto-refund"),
        ("Customer Profile & Orders", "Complete past order history, multiple saved shipping addresses with default toggle"),
        ("Wishlist & Discovery", "1-click move to cart, special offers page, farm-to-table brand story, contact map")
    ]

    for i, (p_title, p_desc) in enumerate(pages_list):
        row = i // 2
        col = i % 2
        x = Inches(0.8 + col * 5.95)
        y = Inches(2.0 + row * 1.2)

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.75), Inches(1.05))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        tb = s4.shapes.add_textbox(x + Inches(0.2), y + Inches(0.12), Inches(5.35), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True

        h = tf.paragraphs[0]
        h.text = f"📄 {p_title}"
        h.font.size = Pt(14)
        h.font.bold = True
        h.font.color.rgb = COLOR_TEXT_LIGHT
        h.font.name = "Arial"

        d = tf.add_paragraph()
        d.text = p_desc
        d.font.size = Pt(11)
        d.font.color.rgb = COLOR_TEXT_MUTED
        d.font.name = "Arial"

    # ==============================================================
    # SLIDE 5: ADMIN ERP & STORE OPERATIONS (10 MODULES)
    # ==============================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "Store Management ERP", "10 Integrated Business Administration Modules", "Complete back-office control for warehouse, inventory, discounts, and dispatch")

    admin_modules = [
        ("KPI Analytics Dashboard", "Real-time revenue metrics, order velocity, active catalog count, and low-stock alerts."),
        ("Product Catalog Manager", "Create, edit, and categorize products with MRP, discount pricing, Telugu names, and units."),
        ("Order Dispatch Pipeline", "Move orders seamlessly through Pending ➔ Confirmed ➔ Packed ➔ Out for Delivery ➔ Delivered."),
        ("Inventory & Stock Logs", "Real-time stock adjustments (+/-) with automated change-reason recording for audit compliance."),
        ("Dynamic Coupon Engine", "Create flat or % discount codes, configure expiration dates, usage limits, and minimum cart value."),
        ("Customer CRM & Reports", "Track customer lifetime orders and spending; export sales and revenue analytics reports.")
    ]

    for i, (m_title, m_desc) in enumerate(admin_modules):
        row = i // 3
        col = i % 3
        x = Inches(0.8 + col * 3.95)
        y = Inches(2.0 + row * 2.35)

        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.8), Inches(2.15))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        tb = s5.shapes.add_textbox(x + Inches(0.25), y + Inches(0.2), Inches(3.3), Inches(1.75))
        tf = tb.text_frame
        tf.word_wrap = True

        h = tf.paragraphs[0]
        h.text = m_title
        h.font.size = Pt(15)
        h.font.bold = True
        h.font.color.rgb = COLOR_AMBER
        h.font.name = "Arial"

        d = tf.add_paragraph()
        d.space_before = Pt(8)
        d.text = m_desc
        d.font.size = Pt(12)
        d.font.color.rgb = COLOR_TEXT_LIGHT
        d.font.name = "Arial"

    # ==============================================================
    # SLIDE 6: MOBILE APP READY (CAPACITOR ANDROID)
    # ==============================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "Mobile App Readiness", "Web + Android Mobile App in a Single Package", "Pre-configured Capacitor Android container saving over ₹75,000 in mobile app development")

    app_points = [
        ("Unified Single Codebase", "No need to hire separate Flutter or React Native developers. Any product update appears instantly on both web and app."),
        ("Zero App Store Latency", "Sync latest web builds to the Android app in seconds with `npm run cap:sync`."),
        ("Native Android APK Generation", "Pre-configured with `@capacitor/android` and `@capacitor/core` ready for Play Store deployment."),
        ("Verified 320px Mobile Responsiveness", "All 16 mobile UI defects thoroughly audited and resolved across all device viewports.")
    ]

    for i, (ap_title, ap_desc) in enumerate(app_points):
        y = Inches(2.0 + i * 1.2)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(1.05))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        tb = s6.shapes.add_textbox(Inches(1.1), y + Inches(0.12), Inches(11.1), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True

        h = tf.paragraphs[0]
        h.text = f"📱  {ap_title}"
        h.font.size = Pt(15)
        h.font.bold = True
        h.font.color.rgb = COLOR_EMERALD
        h.font.name = "Arial"

        d = tf.add_paragraph()
        d.text = ap_desc
        d.font.size = Pt(12)
        d.font.color.rgb = COLOR_TEXT_LIGHT
        d.font.name = "Arial"

    # ==============================================================
    # SLIDE 7: COMMERCIAL VALUATION & REPLACEMENT COST
    # ==============================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "Development Cost & Market Value", "Replacement Cost to Build From Scratch", "Transparent agency rate comparison: 235 hours of professional engineering")

    # Table breakdown
    val_items = [
        ("Customer Storefront (15 Pages)", "145 hrs", "₹1,16,000", "$5,800"),
        ("Admin ERP Suite (10 Modules)", "90 hrs", "₹72,000", "$3,600"),
        ("Capacitor Android Mobile Setup", "Included", "₹25,000", "$1,200"),
        ("Responsive QA & Defect Resolution", "16 Defects Fixed", "₹15,000", "$750"),
        ("TOTAL AGENCY VALUATION", "235+ hrs", "₹2,28,000", "$11,350")
    ]

    for i, (item, hrs, inr, usd) in enumerate(val_items):
        y = Inches(2.0 + i * 0.95)
        is_total = (i == len(val_items) - 1)

        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(0.85))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_EMERALD_DARK if is_total else COLOR_BG_CARD
        card.line.color.rgb = COLOR_EMERALD if is_total else COLOR_CARD_BORDER

        tb = s7.shapes.add_textbox(Inches(1.1), y + Inches(0.12), Inches(11.1), Inches(0.6))
        tf = tb.text_frame

        p = tf.paragraphs[0]
        p.text = f"{item}   |   {hrs}   |   Value: {inr} ({usd})"
        p.font.size = Pt(16 if is_total else 13)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE if is_total else COLOR_TEXT_LIGHT
        p.font.name = "Arial"

    # Callout banner
    c_banner = s7.shapes.add_textbox(Inches(0.8), Inches(6.0), Inches(11.7), Inches(0.8))
    cp = c_banner.text_frame.paragraphs[0]
    cp.alignment = PP_ALIGN.CENTER
    cp.text = "💡 Client Advantage: Acquire this complete ready-to-launch asset at a fraction of agency development costs."
    cp.font.size = Pt(14)
    cp.font.bold = True
    cp.font.color.rgb = COLOR_AMBER
    cp.font.name = "Arial"

    # ==============================================================
    # SLIDE 8: PRICING & INVESTMENT PACKAGES
    # ==============================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "Investment Options", "Three Simple, Transparent Acquisition Packages", "Zero royalties, zero commission cuts, 100% platform ownership")

    packages = [
        ("BASIC", "₹45,000", "($550 USD)", "Codebase Handover", [
            "Complete source code repository",
            "15 Storefront pages + 10 Admin modules",
            "PostgreSQL schema + Seed data scripts",
            "Technical architecture documentation",
            "Self-hosted deployment guide"
        ], COLOR_CARD_BORDER, COLOR_TEXT_LIGHT),

        ("TURNKEY LAUNCH", "₹75,000", "($900 USD)", "Recommended Choice", [
            "Everything in Basic package",
            "Custom brand logo, colors & domain",
            "Live deployment on Vercel & Cloud DB",
            "Initial catalog & category upload",
            "30 Days technical bug-fix warranty"
        ], COLOR_EMERALD, COLOR_EMERALD),

        ("PREMIUM ENTERPRISE", "₹1,10,000", "($1,350 USD)", "Web + Android APK", [
            "Everything in Turnkey Launch",
            "Custom Android APK generated",
            "Google Play Store publishing support",
            "Razorpay payment gateway integration",
            "90 Days extended maintenance & support"
        ], COLOR_AMBER, COLOR_AMBER)
    ]

    for i, (tier, price, usd_p, sub, features, border_col, title_col) in enumerate(packages):
        x = Inches(0.8 + i * 3.95)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(3.8), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = border_col
        card.line.width = Pt(2 if tier != "BASIC" else 1)

        tb = s8.shapes.add_textbox(x + Inches(0.25), Inches(2.15), Inches(3.3), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p_tier = tf.paragraphs[0]
        p_tier.text = tier
        p_tier.font.size = Pt(13)
        p_tier.font.bold = True
        p_tier.font.color.rgb = title_col
        p_tier.font.name = "Arial"

        p_pr = tf.add_paragraph()
        p_pr.text = price
        p_pr.font.size = Pt(28)
        p_pr.font.bold = True
        p_pr.font.color.rgb = COLOR_TEXT_LIGHT
        p_pr.font.name = "Arial"

        p_sub = tf.add_paragraph()
        p_sub.text = f"{usd_p} • {sub}"
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = COLOR_TEXT_MUTED
        p_sub.font.name = "Arial"

        for f in features:
            pf = tf.add_paragraph()
            pf.space_before = Pt(8)
            pf.text = f"✔ {f}"
            pf.font.size = Pt(11)
            pf.font.color.rgb = COLOR_TEXT_LIGHT
            pf.font.name = "Arial"

    # ==============================================================
    # SLIDE 9: OPTIONAL ADD-ONS & FUTURE ROADMAP
    # ==============================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "Future Enhancements & Add-Ons", "Modular Scale When You Need It", "Clear transparent rates for advanced enterprise capabilities")

    addons = [
        ("Automated Razorpay / Cashfree Gateway", "₹10,000 ($125)", "Automated card, netbanking, and UPI webhook verification with zero manual intervention."),
        ("SMS & WhatsApp OTP Login (Zepto-style)", "₹8,500 ($110)", "Passwordless phone number login and instant WhatsApp order tracking notifications."),
        ("Downloadable GST PDF Tax Invoices", "₹6,500 ($80)", "1-Click automated GST compliant tax invoice PDF generation for customer and accounts records."),
        ("Live GPS Delivery Driver Tracking", "₹15,000 ($190)", "Real-time Google Maps driver tracking screen showing arrival time and live route updates.")
    ]

    for i, (add_title, add_price, add_desc) in enumerate(addons):
        y = Inches(2.0 + i * 1.2)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.7), Inches(1.05))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        tb = s9.shapes.add_textbox(Inches(1.1), y + Inches(0.12), Inches(11.1), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True

        h = tf.paragraphs[0]
        h.text = f"{add_title}   —   {add_price}"
        h.font.size = Pt(14)
        h.font.bold = True
        h.font.color.rgb = COLOR_EMERALD
        h.font.name = "Arial"

        d = tf.add_paragraph()
        d.text = add_desc
        d.font.size = Pt(11)
        d.font.color.rgb = COLOR_TEXT_LIGHT
        d.font.name = "Arial"

    # ==============================================================
    # SLIDE 10: NEXT STEPS & 72-HOUR LAUNCH ROADMAP
    # ==============================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "Fast-Track Deployment", "Go Live in Under 72 Hours", "A simple, stress-free 4-step onboarding timeline")

    steps = [
        ("Day 1: Package Selection", "Select your tier (Basic / Turnkey / Premium) and share your store name, logo, and brand color palette."),
        ("Day 2: Cloud Setup & Ingestion", "We connect your custom domain, provision the PostgreSQL cloud database, and import your initial catalog."),
        ("Day 3: Final Review & Testing", "Full QA verification across desktop, tablet, and mobile viewports with simulated test orders."),
        ("Day 4: Live Launch & Promotion", "Your official quick-commerce store goes live to accept customer orders with 0% commissions!")
    ]

    for i, (s_title, s_desc) in enumerate(steps):
        x = Inches(0.8 + i * 2.95)
        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.0), Inches(2.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_BG_CARD
        card.line.color.rgb = COLOR_CARD_BORDER

        tb = s10.shapes.add_textbox(x + Inches(0.2), Inches(2.2), Inches(2.4), Inches(4.0))
        tf = tb.text_frame
        tf.word_wrap = True

        st = tf.paragraphs[0]
        st.text = f"STEP 0{i+1}"
        st.font.size = Pt(12)
        st.font.bold = True
        st.font.color.rgb = COLOR_AMBER
        st.font.name = "Arial"

        h = tf.add_paragraph()
        h.space_before = Pt(8)
        h.text = s_title
        h.font.size = Pt(15)
        h.font.bold = True
        h.font.color.rgb = COLOR_TEXT_LIGHT
        h.font.name = "Arial"

        d = tf.add_paragraph()
        d.space_before = Pt(10)
        d.text = s_desc
        d.font.size = Pt(12)
        d.font.color.rgb = COLOR_TEXT_MUTED
        d.font.name = "Arial"

    # Save output
    output_path = "c:\\Users\\pathl\\OneDrive\\Desktop\\sai naturals\\Sri_Sai_Naturals_Client_Pitch_Deck.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to {output_path}")

if __name__ == "__main__":
    create_presentation()
