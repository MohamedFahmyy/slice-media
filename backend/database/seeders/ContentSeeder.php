<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\LeadActivity;
use App\Models\LeadNote;
use App\Models\NavigationMenu;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\PageTranslation;
use App\Models\PortfolioProject;
use App\Models\PortfolioTranslation;
use App\Models\Service;
use App\Models\ServiceTranslation;
use App\Models\SiteSetting;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoTranslation;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::where('email', 'superadmin@slicemedia.agency')->first();
        $salesAgent = User::where('email', 'agent.omar@slicemedia.agency')->first();

        // 1. Site Settings
        SiteSetting::setValue('branding', [
            'agency_name' => 'Slice Marketing Agency',
            'tagline_en' => 'We Make Brands Impossible To Ignore',
            'tagline_ar' => 'نجعل علامتك التجارية مستحيلة التجاوز',
            'primary_color' => '#D50000',
            'background_color' => '#050505',
            'surface_color' => '#0E0E0E',
            'logo_white_url' => '/assets/slice-logo-full.png',
            'logo_dark_url' => '/assets/slice-logo.png',
            'favicon_url' => '/assets/slice-logo.png',
        ], 'branding');

        SiteSetting::setValue('contact_info', [
            'email' => 'partnerships@slicemedia.agency',
            'phone' => '+20 100 000 0000',
            'whatsapp' => '+201000000000',
            'cairo_office' => 'District 5, New Cairo, Egypt',
            'dubai_office' => 'Dubai Media City, Building 4, UAE',
            'riyadh_office' => 'Al Olaya Towers, Riyadh, KSA',
        ], 'contact');

        SiteSetting::setValue('social_links', [
            'instagram' => 'https://instagram.com/slicemedia',
            'tiktok' => 'https://tiktok.com/@slicemedia',
            'linkedin' => 'https://linkedin.com/company/slice-media',
            'youtube' => 'https://youtube.com/@slicemedia',
        ], 'social');

        SiteSetting::setValue('seo_defaults', [
            'meta_title_en' => 'SLICE — Social Media Marketing & Digital Growth Agency',
            'meta_title_ar' => 'سلايس — وكالة التسويق الرقمي وصناعة المحتوى الفيروسي',
            'meta_description_en' => 'We make brands impossible to ignore. High-retention short-form video, full-funnel paid performance, and cultural marketing across Cairo, Dubai, and Riyadh.',
            'meta_description_ar' => 'وكالة متخصصة في صناعة المحتوى الفيروسي قصير المدى، وإدارة الحملات الإعلانية المدفوعة، وبناء الهيمنة الرقمية للعلامات الطموحة.',
            'og_image' => '/assets/slice-logo-full.png',
        ], 'seo');

        // 2. Navigation Menus
        NavigationMenu::updateOrCreate(['location' => 'header'], [
            'name' => 'Main Navigation',
            'items' => [
                ['id' => 'services', 'label_en' => 'Services', 'label_ar' => 'خدماتنا', 'href' => '#services'],
                ['id' => 'formats', 'label_en' => 'Video Formats', 'label_ar' => 'الفورمات', 'href' => '#formats'],
                ['id' => 'work', 'label_en' => 'Work', 'label_ar' => 'أعمالنا', 'href' => '#work'],
                ['id' => 'why-us', 'label_en' => 'Why Slice', 'label_ar' => 'لماذا سلايس', 'href' => '#why-us'],
                ['id' => 'process', 'label_en' => 'Process', 'label_ar' => 'منهجية العمل', 'href' => '#process'],
                ['id' => 'contact', 'label_en' => 'Contact', 'label_ar' => 'تواصل معنا', 'href' => '#contact'],
            ],
        ]);

        NavigationMenu::updateOrCreate(['location' => 'footer'], [
            'name' => 'Footer Navigation',
            'items' => [
                'columns' => [
                    [
                        'title_en' => 'Navigation',
                        'title_ar' => 'الروابط الرئيسية',
                        'links' => [
                            ['label_en' => 'Services & Capabilities', 'label_ar' => 'الخدمات والقدرات', 'href' => '#services'],
                            ['label_en' => 'Video Formats', 'label_ar' => 'مختبر الفورمات', 'href' => '#formats'],
                            ['label_en' => 'Case Studies', 'label_ar' => 'دراسات الحالة', 'href' => '#work'],
                            ['label_en' => 'Why Slice', 'label_ar' => 'لماذا سلايس', 'href' => '#why-us'],
                        ],
                    ],
                    [
                        'title_en' => 'Services',
                        'title_ar' => 'الخدمات',
                        'links' => [
                            ['label_en' => 'Viral Short-Form Content', 'label_ar' => 'صناعة المحتوى الفيروسي', 'href' => '#services'],
                            ['label_en' => 'Paid Performance Ads', 'label_ar' => 'الإعلانات الممولة والأداء', 'href' => '#services'],
                            ['label_en' => 'Creator & UGC Lab', 'label_ar' => 'مختبر صناع المحتوى و UGC', 'href' => '#services'],
                            ['label_en' => 'Full Account Management', 'label_ar' => 'إدارة الحسابات الشاملة', 'href' => '#services'],
                        ],
                    ],
                ],
            ],
        ]);

        // 3. Services
        $servicesData = [
            [
                'slug' => 'viral-content-creation',
                'order' => 1,
                'duration_en' => 'Continuous / Monthly',
                'duration_ar' => 'مستمر / شهرياً',
                'deliverables' => [
                    'Scriptwriting with Retention Hooks',
                    'High-Definition Studio & Field Filming',
                    'Dynamic Fast-Paced Editing & Color Grading',
                    'Custom Sound Design & Trending Audio Integration',
                ],
                'en' => [
                    'title' => 'Viral Content Creation & Video Formats',
                    'description' => 'Original skits, narrative brand storytelling, street vox-pops, and high-retention vertical videos specifically engineered for TikTok, Reels, and YouTube Shorts.',
                    'details' => 'Our proprietary content engine develops narrative storylines, scripted micro-dramas, and culturally resonant street interviews that captivate viewers in the first 1.5 seconds and maintain average retention rates above 70%.',
                ],
                'ar' => [
                    'title' => 'صناعة المحتوى الفيروسي والفورمات المرئية',
                    'description' => 'إنتاج فيديوهات ريلز وسكتشات واستطلاعات رأي سريعة مصممة لاحتلال التريند وتحقيق أرقام مشاهدات قياسية بمعدلات احتفاظ فائقة.',
                    'details' => 'نطور أفكاراً وسيناريوهات تصوير احترافية تركز على "خطف الانتباه" في أول ثانية ونصف، مع مونتاج سينمائي سريع ومؤثرات صوتية ترفع معدل استكمال المشاهدة لأكثر من 70%.',
                ],
            ],
            [
                'slug' => 'social-media-growth',
                'order' => 2,
                'duration_en' => 'Quarterly Retainer',
                'duration_ar' => 'عقد ربع سنوي',
                'deliverables' => [
                    'Comprehensive Account Content Calendar',
                    'Daily Community Engagement & Moderation',
                    'Strategic Platform Positioning',
                    'Monthly Growth & Conversion Analytics',
                ],
                'en' => [
                    'title' => 'Social Media Growth & Account Management',
                    'description' => 'End-to-end channel operations, active community building, content calendar execution, and organic audience scaling across Instagram, TikTok, and LinkedIn.',
                    'details' => 'We handle everything from daily publishing schedules to active audience conversation mining, turning passive followers into loyal brand advocates.',
                ],
                'ar' => [
                    'title' => 'إدارة الحسابات والنمو العضوي الشامل',
                    'description' => 'إشراف يومي متكامل على منصاتكم الرقمية، بناء الجماهير المخلصة، وجدولة النشر مع دراسة الخوارزميات وتفاعل المتابعين.',
                    'details' => 'نتولى إدارة حسابات علامتك التجارية من الصفر: جدولة النشر، إدارة المحادثات والتعليقات، واستخراج تحليلات تفاعل المتابعين لتحويلهم إلى مشترين مخلصين.',
                ],
            ],
            [
                'slug' => 'performance-paid-ads',
                'order' => 3,
                'duration_en' => 'Continuous Scaling',
                'duration_ar' => 'توسع مستمر',
                'deliverables' => [
                    'Full-Funnel Campaign Architecture',
                    'High-Converting Ad Creatives & UGC Iterations',
                    'Custom Pixel, CAPI, & Analytics Tracking',
                    'Continuous A/B Hook & Audience Testing',
                ],
                'en' => [
                    'title' => 'Performance Marketing & Paid Social Campaigns',
                    'description' => 'Hyper-targeted Meta, TikTok, and Google ad funnels engineered to convert engaged viewers into high-value paying customers and measurable pipeline revenue.',
                    'details' => 'We combine viral organic creative assets with rigorous performance ad setups, continuous multivariate hook testing, and conversion rate optimization.',
                ],
                'ar' => [
                    'title' => 'الإعلانات الممولة والأداء التسويقي (Paid Social)',
                    'description' => 'إطلاق وإدارة حملات إعلانية احترافية مدروسة على ميتا وتيك توك وجوجل، تستهدف تحويل المشاهدات إلى مبيعات وعوائد استثمار حقيقية.',
                    'details' => 'ندمج كريتيف المحتوى الفيروسي مع هيكلة إعلانات متقدمة، واختبارات A/B مستمرة للهوك والجمهور لتحقيق أعلى عائد على الإنفاق الإعلاني (ROAS).',
                ],
            ],
            [
                'slug' => 'influencer-ugc-campaigns',
                'order' => 4,
                'duration_en' => 'Campaign / Monthly',
                'duration_ar' => 'لكل حملة / شهرياً',
                'deliverables' => [
                    'Vetted Creator Shortlist & Briefing',
                    'Authentic Product Seeding & Unboxing Scripting',
                    'Usage Rights & Whitelisting Negotiation',
                    'Performance Attribution & Tracking',
                ],
                'en' => [
                    'title' => 'Influencer Activations & Authentic UGC Lab',
                    'description' => 'Direct access to vetted regional creators, product unboxing narratives, and genuine customer testimonial video assets for multi-channel usage.',
                    'details' => 'We source and manage top-tier content creators across Egypt, the UAE, and Saudi Arabia, producing authentic user-generated content that blends seamlessly into users feeds.',
                ],
                'ar' => [
                    'title' => 'حملات المؤثرين ومختبر الـ UGC الواقعي',
                    'description' => 'ربط علامتك بأفضل صناع المحتوى المؤثرين في مصر والخليج لتقديم مراجعات وتجارب واقعية تلقى مصداقية فورية لدى المستهلكين.',
                    'details' => 'نوفر شبكة حصرية من صناع المحتوى المحترفين لإنتاج مقاطع فيديو أصلية غير متكلفة، تدمج المنتج بذكاء في حياة المتابع وتكسب ثقته المباشرة.',
                ],
            ],
        ];

        foreach ($servicesData as $sData) {
            $service = Service::updateOrCreate(['slug' => $sData['slug']], [
                'order' => $sData['order'],
                'duration_en' => $sData['duration_en'],
                'duration_ar' => $sData['duration_ar'],
                'deliverables' => $sData['deliverables'],
                'is_visible' => true,
            ]);

            ServiceTranslation::updateOrCreate([
                'service_id' => $service->id,
                'locale' => 'en',
            ], [
                'title' => $sData['en']['title'],
                'description' => $sData['en']['description'],
                'details' => $sData['en']['details'],
            ]);

            ServiceTranslation::updateOrCreate([
                'service_id' => $service->id,
                'locale' => 'ar',
            ], [
                'title' => $sData['ar']['title'],
                'description' => $sData['ar']['description'],
                'details' => $sData['ar']['details'],
            ]);
        }

        // 4. Portfolio Projects
        $projectsData = [
            [
                'slug' => 'aura-atelier',
                'client_name' => 'AURA // ATELIER',
                'industry' => 'Contemporary Streetwear',
                'order' => 1,
                'is_featured' => true,
                'featured_image' => '/assets/project-streetwear.jpg',
                'en' => [
                    'title' => 'Streetwear Heritage Drop Campaign',
                    'summary' => 'A cinematic short-form campaign transforming a boutique Egyptian apparel label into an internationally coveted streetwear brand with over 8.4M organic views.',
                    'challenge' => 'The brand had exceptional garments but struggled with low visual excitement and repetitive static studio product photos that failed to hook younger buyers.',
                    'strategy' => 'We designed raw 9:16 urban storytelling skits showcasing garment textures through dramatic night lighting and fast-paced micro-dramas.',
                    'execution' => 'Produced 18 high-velocity Reels and TikTok videos filmed on downtown Cairo rooftops paired with exclusive sound design and dynamic typography.',
                    'outcomes' => '8.4M+ combined views, 3 consecutive sold-out collections, and a 420% increase in direct Instagram shop checkout orders.',
                ],
                'ar' => [
                    'title' => 'حملة إطلاق مجموعة أزياء الشارع المعاصرة',
                    'summary' => 'حملة محتوى بصري سينمائي حوّلت علامة أزياء مصرية إلى براند رائج يحقق أكثر من 8.4 مليون مشاهدة عضوية وثلاث مجموعات مباعة بالكامل.',
                    'challenge' => 'كان البراند يمتلك جودة عالية لكنه يعاني من ضعف الإثارة البصرية والاعتماد على صور الاستوديو الثابتة التي لم تلفت انتباه جيل الشباب.',
                    'strategy' => 'صممنا مقاطع ريلز بتصوير ليلي درامي وسيناريوهات حضرية سريعة تُبرز تفاصيل القماش وجودة التصنيع بطريقة استعراضية خاطفة.',
                    'execution' => 'إنتاج 18 مقطع فيديو عالي الجودة في مواقع تصوير حية بوسط القاهرة، مصحوبة بمؤثرات صوتية حصرية وهوك تفاعلي في أول ثانية.',
                    'outcomes' => 'أكثر من 8.4 مليون مشاهدة عضوية، نفاد 3 دفعات إنتاجية بالكامل، وزيادة بنسبة 420% في طلبات المتجر المباشرة.',
                ],
            ],
            [
                'slug' => 'blackwood-coffee-co',
                'client_name' => 'BLACKWOOD COFFEE CO.',
                'industry' => 'Specialty Coffee & Hospitality',
                'order' => 2,
                'is_featured' => true,
                'featured_image' => '/assets/project-coffee.jpg',
                'en' => [
                    'title' => 'Sensory Morning Routine Campaign',
                    'summary' => 'Transforming single-origin specialty roast rituals into addictive ASMR sensory content across Dubai and Riyadh.',
                    'challenge' => 'Specialty coffee marketing often feels dry and technical, alienating everyday coffee drinkers who just want a premium morning ritual.',
                    'strategy' => 'Focus on ASMR sound design, ultra-crisp macro pour shots, and comedic barista-customer skits demystifying brew ratios.',
                    'execution' => 'Filmed high-speed macro video series highlighting extraction honey pours, combined with street taste tests outside top creative hubs.',
                    'outcomes' => '6.2M views, 340% increase in bean subscription sign-ups, and a massive spike in café foot traffic.',
                ],
                'ar' => [
                    'title' => 'سلسلة تجربة القهوة المختصة والحواس الخمس',
                    'summary' => 'تحويل طقوس تحضير القهوة الفاخرة إلى تجربة حسية ASMR وسكتشات فكاهية اجتاحت مجتمع القهوة في دبي والرياض.',
                    'challenge' => 'كان محتوى القهوة المختصة معقداً ومليئاً بالمصطلحات الفنية التي تنفر المستهلك العادي الذي يبحث فقط عن صباح استثنائي.',
                    'strategy' => 'التركيز على أصوات الطحن والصب فائق النقاء (ASMR) وسكتشات خفيفة الظل تكسر الجليد مع عشاق القهوة الجدد.',
                    'execution' => 'تصوير سينمائي مقرب جداً مع إضاءة دافئة وسلسلة "تحدي تذوق القهوة في الشارع" مع الجمهور.',
                    'outcomes' => '6.2 مليون مشاهدة، نمو الاشتراكات الشهرية لشراء حبوب القهوة بنسبة 340%، وازدحام الفروع خلال عطلات الأسبوع.',
                ],
            ],
            [
                'slug' => 'slice-creator-lab',
                'client_name' => 'SLICE ORIGINAL CREATOR LAB',
                'industry' => 'Digital Entertainment & Media IP',
                'order' => 3,
                'is_featured' => true,
                'featured_image' => '/assets/hero-reel.jpg',
                'en' => [
                    'title' => 'Proprietary Cultural Format Incubation',
                    'summary' => 'Building viral media formats, street vox-pops, and unscripted cultural micro-docs that build millions of loyal followers organically.',
                    'challenge' => 'Traditional brand sponsorships often get skipped because they feel like sterile corporate advertisements.',
                    'strategy' => 'We create the entertainment format first, gather an obsessed audience, and seamlessly integrate partner brands as heroes of the story.',
                    'execution' => 'Weekly episodic releases engineered with hook-testing frameworks and rapid retention optimization.',
                    'outcomes' => '14M+ aggregate series impressions and an average watch time 2.3x higher than industry benchmarks.',
                ],
                'ar' => [
                    'title' => 'حاضنة الفورمات والمحتوى الثقافي الرقمي',
                    'summary' => 'تطوير فورمات ترفيهية واستطلاعات رأي بالشارع تبني ملايين المتابعين الأوفياء ويتم دمج العلامات التجارية فيها كجزء طبيعي من القصة.',
                    'challenge' => 'الإعلانات التقليدية يتم تخطيها بسرعة لأنها تبدو تجارية ومصطنعة، وتفتقر للعفوية التي يبحث عنها مستخدم السوشيال ميديا.',
                    'strategy' => 'صناعة فورمات المحتوى الترفيهي أولاً وجذب الجمهور المتشوق، ثم تضمين منتجات الرعاة بطريقة فكاهية وذكية لا تشعر المتابع بالإزعاج.',
                    'execution' => 'نشر حلقات أسبوعية بتنسيق برامج الشارع مع قياس دقيق لنسب الاحتفاظ بالثواني الأولى ومعدلات المشاركة.',
                    'outcomes' => 'أكثر من 14 مليون ظهور تراكمي، ومعدل استكمال مشاهدة يفوق متوسط السوق بـ 2.3 ضعف.',
                ],
            ],
        ];

        foreach ($projectsData as $pData) {
            $project = PortfolioProject::updateOrCreate(['slug' => $pData['slug']], [
                'client_name' => $pData['client_name'],
                'industry' => $pData['industry'],
                'order' => $pData['order'],
                'is_featured' => $pData['is_featured'],
                'is_published' => true,
                'published_at' => now(),
                'featured_image' => $pData['featured_image'],
            ]);

            PortfolioTranslation::updateOrCreate([
                'portfolio_project_id' => $project->id,
                'locale' => 'en',
            ], [
                'title' => $pData['en']['title'],
                'summary' => $pData['en']['summary'],
                'challenge' => $pData['en']['challenge'],
                'strategy' => $pData['en']['strategy'],
                'execution' => $pData['en']['execution'],
                'outcomes' => $pData['en']['outcomes'],
            ]);

            PortfolioTranslation::updateOrCreate([
                'portfolio_project_id' => $project->id,
                'locale' => 'ar',
            ], [
                'title' => $pData['ar']['title'],
                'summary' => $pData['ar']['summary'],
                'challenge' => $pData['ar']['challenge'],
                'strategy' => $pData['ar']['strategy'],
                'execution' => $pData['ar']['execution'],
                'outcomes' => $pData['ar']['outcomes'],
            ]);
        }

        // 5. Videos (3D Video Strip Deck)
        $videosData = [
            [
                'provider' => 'vimeo',
                'provider_id' => '1195094508',
                'format_type' => 'storytelling',
                'order' => 1,
                'is_featured' => true,
                'en' => [
                    'title' => 'High-Paced Narrative Storytelling',
                    'tagline' => 'Brand Lore // Cinematic Shorts',
                    'badge' => 'Storytelling',
                    'description' => 'Fast-paced storytelling that introduces a relatable everyday conflict and resolves it seamlessly with the brand product as the unexpected hero.',
                ],
                'ar' => [
                    'title' => 'السرد القصصي السريع والمشوق',
                    'tagline' => 'قصة البراند // سينما سريعة',
                    'badge' => 'ستوريتلينج',
                    'description' => 'قصة درامية سريعة تطرح مشكلة يومية يمر بها المشاهد، وتقدم حلها الطبيعي عبر منتج علامتك التجارية بطريقة ذكية غير متكلفة.',
                ],
            ],
            [
                'provider' => 'vimeo',
                'provider_id' => '1196280245',
                'format_type' => 'skits',
                'order' => 2,
                'is_featured' => true,
                'en' => [
                    'title' => 'Hyper-Relatable Comedy Skits',
                    'tagline' => 'Viral Humor // Cultural Memes',
                    'badge' => 'Viral Skits',
                    'description' => 'Humorous cultural parodies and relatable situations designed to trigger immediate comments, tag friends, and skyrocket shareability.',
                ],
                'ar' => [
                    'title' => 'السكتشات الكوميدية الفيروسية',
                    'tagline' => 'كوميديا عفوية // تريند الشارع',
                    'badge' => 'سكتشات كوميدية',
                    'description' => 'مشاهد كوميدية واقعية ومواقف طريفة تمس واقع الجمهور وتدفعه فوراً للتعليق ومشاركة الفيديو مع أصدقائه.',
                ],
            ],
            [
                'provider' => 'vimeo',
                'provider_id' => '1195094599',
                'format_type' => 'voxpop',
                'order' => 3,
                'is_featured' => true,
                'en' => [
                    'title' => 'Spontaneous Street Voxpop',
                    'tagline' => 'Public Reactions // Raw Proof',
                    'badge' => 'Street Voxpop',
                    'description' => 'Unfiltered on-the-street interviews and blind taste or blind reaction tests that provide undeniable social proof and maximum curiosity.',
                ],
                'ar' => [
                    'title' => 'استطلاعات رأي الشارع العفوية',
                    'tagline' => 'ردود أفعال حقيقية // مصداقية فورية',
                    'badge' => 'استطلاع شارع',
                    'description' => 'لقاءات عفوية واختبارات حقيقية مع الناس في الشارع تكسب ثقة المشاهد الفورية وتولد تفاعلاً لا يقاوم.',
                ],
            ],
            [
                'provider' => 'vimeo',
                'provider_id' => '1195094508',
                'format_type' => 'ugc',
                'order' => 4,
                'is_featured' => true,
                'en' => [
                    'title' => 'Creator-Led Unfiltered UGC',
                    'tagline' => 'Native Trust // Review Lab',
                    'badge' => 'Creator UGC',
                    'description' => 'Content filmed on phones by trusted lifestyle creators that looks and feels like organic peer-to-peer advice rather than an agency ad.',
                ],
                'ar' => [
                    'title' => 'محتوى صناع المحتوى (UGC الواقعي)',
                    'tagline' => 'ثقة مطلقة // تقييمات موثوقة',
                    'badge' => 'محتوى UGC',
                    'description' => 'مقاطع مصورة بكاميرا الهاتف بواسطة صناع محتوى محترفين، تبدو كنصيحة مخلصة من صديق وليس إعلاناً تقليدياً.',
                ],
            ],
        ];

        foreach ($videosData as $vData) {
            $video = Video::updateOrCreate(
                ['provider_id' => $vData['provider_id'], 'format_type' => $vData['format_type']],
                [
                    'provider' => $vData['provider'],
                    'order' => $vData['order'],
                    'is_featured' => $vData['is_featured'],
                    'is_published' => true,
                    'aspect_ratio' => '9:16',
                ]
            );

            VideoTranslation::updateOrCreate([
                'video_id' => $video->id,
                'locale' => 'en',
            ], [
                'title' => $vData['en']['title'],
                'tagline' => $vData['en']['tagline'],
                'badge' => $vData['en']['badge'],
                'description' => $vData['en']['description'],
            ]);

            VideoTranslation::updateOrCreate([
                'video_id' => $video->id,
                'locale' => 'ar',
            ], [
                'title' => $vData['ar']['title'],
                'tagline' => $vData['ar']['tagline'],
                'badge' => $vData['ar']['badge'],
                'description' => $vData['ar']['description'],
            ]);
        }

        // 6. Homepage CMS Page and Sections
        $homepage = Page::updateOrCreate(['slug' => 'home'], [
            'is_published' => true,
            'published_at' => now(),
            'author_id' => $superAdmin?->id,
            'last_editor_id' => $superAdmin?->id,
            'settings' => [
                'theme' => 'dark',
                'nav_transparent' => true,
            ],
        ]);

        PageTranslation::updateOrCreate([
            'page_id' => $homepage->id,
            'locale' => 'en',
        ], [
            'title' => 'SLICE — We Make Brands Impossible To Ignore',
            'meta_title' => 'SLICE — Social Media Marketing & Digital Growth Agency',
            'meta_description' => 'Creative strategies, scroll-stopping content, and performance-driven campaigns for ambitious brands across Egypt and the Gulf.',
            'og_image' => '/assets/slice-logo-full.png',
        ]);

        PageTranslation::updateOrCreate([
            'page_id' => $homepage->id,
            'locale' => 'ar',
        ], [
            'title' => 'سلايس — نجعل علامتك التجارية مستحيلة التجاوز',
            'meta_title' => 'سلايس — وكالة التسويق الرقمي وصناعة المحتوى الفيروسي',
            'meta_description' => 'استراتيجيات إبداعية، محتوى يخطف الأنظار، وحملات تسويقية تركز على النتائج الحقيقية ونمو العلامات التجارية.',
            'og_image' => '/assets/slice-logo-full.png',
        ]);

        // Seed Core Homepage Sections
        $sections = [
            [
                'section_type' => 'hero',
                'order' => 1,
                'content' => [
                    'badge_en' => 'Viral Content & Growth Agency // Cairo • Dubai • Riyadh',
                    'badge_ar' => 'وكالة المحتوى الفيروسي والنمو // القاهرة • دبي • الرياض',
                    'headline_en' => 'WE MAKE BRANDS IMPOSSIBLE TO IGNORE.',
                    'headline_ar' => 'نجعل علامتك التجارية مستحيلة التجاوز.',
                    'subheadline_en' => 'We engineer scroll-stopping short-form content, viral narrative formats, and full-funnel paid campaigns that turn casual scrollers into obsessed paying customers.',
                    'subheadline_ar' => 'نصنع محتوى مرئي يخطف الأنظار في أول ثوانٍ، وفورمات فيروسية، وحملات ممولة ذكية تحول المشاهدات إلى مبيعات ونمو حقيقي مستدام.',
                    'primary_cta_en' => 'Produce Your Campaign',
                    'primary_cta_ar' => 'ابدأ حملتك القادمة',
                    'secondary_cta_en' => 'Explore Concept Vault',
                    'secondary_cta_ar' => 'استكشف أعمالنا',
                ],
            ],
            [
                'section_type' => 'brand_intro',
                'order' => 2,
                'content' => [
                    'tagline_en' => 'Strategic Art Direction // Organic Retention',
                    'tagline_ar' => 'رؤية إبداعية مدروسة // انتشار عضوي حقيقي',
                    'title_en' => 'Stop burning ad budget on videos people skip in 2 seconds.',
                    'title_ar' => 'توقف عن إهدار ميزانيتك على إعلانات يتخطاها الجمهور في ثانيتين.',
                    'description_en' => 'Attention is the rarest currency in digital business today. At SLICE, we dissect algorithmic psychology, cultural memes, and viewer retention to craft videos that dominate user feeds without feeling like sterile corporate ads.',
                    'description_ar' => 'الانتباه هو أثمن عملة في العالم الرقمي اليوم. في سلايس، ندرس سيكولوجية الخوارزميات وثقافة الشارع لنصنع مقاطع فيديو تجبر المتابع على التوقف واستكمال المشاهدة.',
                ],
            ],
            [
                'section_type' => 'services',
                'order' => 3,
                'content' => [
                    'badge_en' => 'Integrated Capabilities',
                    'badge_ar' => 'خدماتنا وقدراتنا',
                    'headline_en' => 'FULL-STACK DIGITAL GROWTH ENGINES',
                    'headline_ar' => 'منظومة متكاملة لصناعة الهيمنة الرقمية',
                    'subheadline_en' => 'From viral concept creation to technical ad arbitrage and creator management, we provide complete creative ammunition for modern consumer brands.',
                    'subheadline_ar' => 'من الفكرة وكتابة السيناريو إلى التصوير السينمائي وإدارة الإعلانات، نقدم ترسانة تسويقية متكاملة تدعم نموك التجاري.',
                ],
            ],
            [
                'section_type' => 'video_strip',
                'order' => 4,
                'content' => [
                    'badge_en' => '3D Video Strip // Proprietary Formats',
                    'badge_ar' => 'مختبر الفورمات // ابتكار المحتوى',
                    'headline_en' => 'THE FORMULA BEHIND OUR RETENTION',
                    'headline_ar' => 'المعادلة السرية لاحتفاظ المشاهدين',
                    'subheadline_en' => 'We do not shoot random videos. Every second is mapped to cognitive retention triggers, emotional pacing, and strategic product placement.',
                    'subheadline_ar' => 'لا نصور مقاطع عشوائية. كل ثانية مدروسة بمحفزات نفسية وإيقاع تصاعدي يجعل علامتك بطل القصة الدائم.',
                ],
            ],
            [
                'section_type' => 'portfolio',
                'order' => 5,
                'content' => [
                    'badge_en' => 'Selected Concept Cases',
                    'badge_ar' => 'نماذج من أعمالنا',
                    'headline_en' => 'HIGH-IMPACT CAMPAIGN BLUEPRINTS',
                    'headline_ar' => 'حملات رقمية حققت أرقاماً استثنائية',
                    'subheadline_en' => 'Real strategic playbooks executed with surgical precision across luxury fashion, specialty coffee, and cultural consumer products.',
                    'subheadline_ar' => 'خطط واستراتيجيات مبتكرة تم تنفيذها بدقة لعلامات الأزياء الراقية، المقاهي المختصة، والمنتجات الاستهلاكية الرائدة.',
                ],
            ],
            [
                'section_type' => 'contact',
                'order' => 6,
                'content' => [
                    'badge_en' => 'Partnership Inquiry',
                    'badge_ar' => 'ابدأ التعاون معنا',
                    'headline_en' => 'READY TO MAKE YOUR BRAND IMPOSSIBLE TO IGNORE?',
                    'headline_ar' => 'جاهز لجعل علامتك التجارية مستحيلة التجاوز؟',
                    'subheadline_en' => 'Tell us about your brand, current challenges, and growth goals. Our creative directors review every brief within 24 hours.',
                    'subheadline_ar' => 'شاركنا تفاصيل علامتك، أهدافك الحالية، وتحدياتك التسويقية. سيقوم فريقنا الإبداعي بدراسة طلبك والرد خلال 24 ساعة.',
                ],
            ],
        ];

        foreach ($sections as $sec) {
            PageSection::updateOrCreate(
                ['page_id' => $homepage->id, 'section_type' => $sec['section_type']],
                [
                    'order' => $sec['order'],
                    'is_enabled' => true,
                    'content' => $sec['content'],
                ]
            );
        }

        // 7. Seed Initial Test Leads for CRM Validation
        $sampleLeads = [
            [
                'reference_code' => 'SLC-84920',
                'full_name' => 'Tarek Mansour',
                'email' => 'tarek@khedewygroup.com',
                'phone' => '+20 100 123 4567',
                'company' => 'Khedewy Real Estate Developments',
                'requested_service' => 'Viral Content Creation & Video Formats',
                'budget_range' => '$5,000 - $10,000 / month',
                'project_description' => 'Looking to produce 20 cinematic vertical video reels per month showcasing our luxury branded residences in New Zayed.',
                'preferred_language' => 'en',
                'status' => 'new',
                'priority' => 'high',
                'estimated_deal_value' => 8500.00,
                'source' => 'website_contact',
                'utm_source' => 'linkedin',
                'utm_medium' => 'cpc',
                'utm_campaign' => 'q4_enterprise_branding',
            ],
            [
                'reference_code' => 'SLC-73911',
                'full_name' => 'Noura Al-Otaibi',
                'email' => 'noura@velour-riyadh.sa',
                'phone' => '+966 55 987 6543',
                'company' => 'Velour Luxury Fragrances',
                'requested_service' => 'Influencer Activations & Authentic UGC Lab',
                'budget_range' => '$10,000 - $25,000 / month',
                'project_description' => 'We are launching an oriental oud and bergamot collection across Saudi Arabia. Need vetted creator unboxings and paid TikTok ads.',
                'preferred_language' => 'ar',
                'status' => 'qualified',
                'priority' => 'urgent',
                'estimated_deal_value' => 18000.00,
                'assigned_to' => $salesAgent?->id,
                'source' => 'website_contact',
                'utm_source' => 'instagram',
                'utm_medium' => 'organic',
            ],
            [
                'reference_code' => 'SLC-61802',
                'full_name' => 'Zaid Al-Husseini',
                'email' => 'zaid@roasteryhub.ae',
                'phone' => '+971 50 111 2233',
                'company' => 'Roastery Hub Dubai',
                'requested_service' => 'Social Media Growth & Account Management',
                'budget_range' => '$3,000 - $5,000 / month',
                'project_description' => 'Need full social media takeover and creative direction to open our new branch in Jumeirah.',
                'preferred_language' => 'en',
                'status' => 'contacted',
                'priority' => 'medium',
                'estimated_deal_value' => 4500.00,
                'assigned_to' => $salesAgent?->id,
                'source' => 'website_contact',
            ],
            [
                'reference_code' => 'SLC-52940',
                'full_name' => 'Hossam El-Din',
                'email' => 'hossam@urbanfit-eg.com',
                'phone' => '+20 122 333 4455',
                'company' => 'Urban Fit Apparel',
                'requested_service' => 'Performance Marketing & Paid Social Campaigns',
                'budget_range' => '$5,000 - $10,000 / month',
                'project_description' => 'Scale our monthly online store revenue from 800k EGP to 2.5M EGP through Meta and TikTok ads.',
                'preferred_language' => 'ar',
                'status' => 'proposal_sent',
                'priority' => 'high',
                'estimated_deal_value' => 7000.00,
                'assigned_to' => $salesAgent?->id,
                'source' => 'website_contact',
            ],
            [
                'reference_code' => 'SLC-41005',
                'full_name' => 'Laila Shenouda',
                'email' => 'laila@skinbotanica.com',
                'phone' => '+20 109 888 7766',
                'company' => 'Skin Botanica Clean Cosmetics',
                'requested_service' => 'Viral Content Creation & Video Formats',
                'budget_range' => '$3,000 - $5,000 / month',
                'project_description' => 'Signed 6-month contract for monthly viral skincare routine reels.',
                'preferred_language' => 'en',
                'status' => 'won',
                'priority' => 'high',
                'estimated_deal_value' => 4000.00,
                'won_at' => now()->subDays(3),
                'assigned_to' => $salesAgent?->id,
                'source' => 'referral',
            ],
        ];

        foreach ($sampleLeads as $leadData) {
            $lead = Lead::updateOrCreate(
                ['reference_code' => $leadData['reference_code']],
                $leadData
            );

            // Add sample note and activity
            LeadNote::create([
                'lead_id' => $lead->id,
                'user_id' => $superAdmin?->id,
                'content' => "Initial project brief received and reviewed. Client has strong brand assets and clear expansion budget.",
            ]);

            LeadActivity::create([
                'lead_id' => $lead->id,
                'user_id' => $superAdmin?->id,
                'action_type' => 'created',
                'description' => "Lead {$lead->reference_code} captured from website contact form.",
                'metadata' => [
                    'source' => $lead->source,
                    'service' => $lead->requested_service,
                ],
            ]);
        }
    }
}
