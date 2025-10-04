import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../shared/widgets/common/space_background.dart';
import '../../../../shared/widgets/common/navbar_fixed.dart';
import '../providers/home_providers.dart';
import '../widgets/hero_section.dart';
import '../widgets/feature_card.dart';
import '../widgets/section_widget.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HomeProvider>().loadUserData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;
    final isTablet = screenSize.width >= 600 && screenSize.width < 1200;

    return Scaffold(
      body: Stack(
        children: [
          // Space Background
          const SpaceBackground(),

          // Content
          SingleChildScrollView(
            controller: _scrollController,
            child: Column(
              children: [
                // Hero Section
                HeroSection(isMobile: isMobile, isTablet: isTablet),
                
                // How It Works Section
                _buildHowItWorksSection(isMobile, isTablet),
                
                // Why It Matters Section
                _buildWhyItMattersSection(isMobile),
                
                // Features Section
                _buildFeaturesSection(isMobile, isTablet),
                
                // Future Scope Section
                _buildFutureScopeSection(isMobile),
                
                // Quote Footer
                _buildQuoteFooter(),
              ],
            ),
          ),

          // Fixed Navbar
          const Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: NavbarFixed(),
          ),
        ],
      ),
    );
  }

  Widget _buildHowItWorksSection(bool isMobile, bool isTablet) {
    final features = [
      {
        'icon': '📡',
        'title': 'Data Ingestion',
        'description': 'We harness vast datasets from legendary NASA missions like Kepler and TESS, capturing the light from distant stars.',
      },
      {
        'icon': '🤖',
        'title': 'AI Analysis',
        'description': 'Our deep learning models are trained to find the faint, tell-tale dips in starlight that signal a planet passing by.',
      },
      {
        'icon': '🌍',
        'title': 'Planet Identification',
        'description': 'The AI highlights potential exoplanets, empowering astronomers to focus on confirming the next new world.',
      },
    ];

    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : 40,
        vertical: isMobile ? 60 : 80,
      ),
      child: Column(
        children: [
          SectionHeader(
            title: 'From Starlight to Discovery',
            isMobile: isMobile,
          ),
          SizedBox(height: isMobile ? 40 : 64),
          LayoutBuilder(
            builder: (context, constraints) {
              final crossAxisCount = isMobile ? 1 : (isTablet ? 2 : 3);
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: crossAxisCount,
                  crossAxisSpacing: isMobile ? 16 : 24,
                  mainAxisSpacing: isMobile ? 16 : 24,
                  childAspectRatio: isMobile ? 1.2 : 1.1,
                ),
                itemCount: features.length,
                itemBuilder: (context, index) {
                  return FeatureCard(
                    icon: features[index]['icon']!,
                    title: features[index]['title']!,
                    description: features[index]['description']!,
                    index: index,
                    isMobile: isMobile,
                  );
                },
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildWhyItMattersSection(bool isMobile) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : 40,
        vertical: isMobile ? 60 : 80,
      ),
      child: Column(
        children: [
          SectionHeader(
            title: 'The Quest for Another Earth',
            isMobile: isMobile,
          ),
          SizedBox(height: isMobile ? 24 : 32),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: isMobile ? 8 : 16),
            child: Text(
              'Every exoplanet is a clue in the grand puzzle of the universe. By accelerating this process, '
              'we move closer to answering humanity\'s oldest question: Are we alone? This project aids the '
              'search for habitable, Earth-like worlds, pushing the boundaries of what we know.',
              style: isMobile 
                  ? TextStyles.bodyMedium.copyWith(
                      color: Colors.white.withOpacity(0.9),
                      height: 1.6,
                    )
                  : TextStyles.bodyLarge.copyWith(
                      color: Colors.white.withOpacity(0.9),
                      height: 1.6,
                    ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    ).animate(delay: 400.ms).slideY(begin: 0.3).fadeIn();
  }

  Widget _buildFeaturesSection(bool isMobile, bool isTablet) {
    final features = [
      '🚀 AI-Powered Detection: Instantly identify potential exoplanets from raw stellar data.',
      '🔬 High-Fidelity Accuracy: Built on trusted, open-source datasets directly from NASA.',
      '📊 Interactive Predictions: Upload your own data and witness the AI analysis in action.',
      '🌌 Stunning Visualizations: Understand the data with clear and interactive light curve graphs.',
    ];

    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : 40,
        vertical: isMobile ? 60 : 80,
      ),
      child: Column(
        children: [
          SectionHeader(
            title: 'Your Toolkit for Exploration',
            isMobile: isMobile,
          ),
          SizedBox(height: isMobile ? 40 : 64),
          LayoutBuilder(
            builder: (context, constraints) {
              final crossAxisCount = isMobile ? 1 : (isTablet ? 2 : 2);
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: crossAxisCount,
                  crossAxisSpacing: isMobile ? 16 : 24,
                  mainAxisSpacing: isMobile ? 16 : 24,
                  childAspectRatio: isMobile ? 1.8 : 2.5,
                ),
                itemCount: features.length,
                itemBuilder: (context, index) {
                  return Container(
                    padding: EdgeInsets.all(isMobile ? 20 : 32),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withOpacity(0.2)),
                    ),
                    child: Text(
                      features[index],
                      style: isMobile
                          ? TextStyles.bodyMedium.copyWith(
                              color: Colors.white.withOpacity(0.9),
                            )
                          : TextStyles.bodyLarge.copyWith(
                              color: Colors.white.withOpacity(0.9),
                            ),
                    ),
                  ).animate(delay: (300 + index * 200).ms).slideX(
                    begin: index.isEven ? -0.3 : 0.3,
                  ).fadeIn();
                },
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFutureScopeSection(bool isMobile) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: isMobile ? 20 : 40,
        vertical: isMobile ? 60 : 80,
      ),
      child: Column(
        children: [
          SectionHeader(
            title: 'Charting the Course Ahead',
            isMobile: isMobile,
          ),
          SizedBox(height: isMobile ? 24 : 32),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: isMobile ? 8 : 16),
            child: Text(
              'Our journey is just beginning. We aim to expand our model to cover new missions like '
              'the James Webb Space Telescope, classify planets by type and habitability, and collaborate '
              'with astronomers to turn predictions into confirmed discoveries.',
              style: isMobile
                  ? TextStyles.bodyMedium.copyWith(
                      color: Colors.white.withOpacity(0.9),
                      height: 1.6,
                    )
                  : TextStyles.bodyLarge.copyWith(
                      color: Colors.white.withOpacity(0.9),
                      height: 1.6,
                    ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    ).animate(delay: 700.ms).slideY(begin: 0.3).fadeIn();
  }

  Widget _buildQuoteFooter() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 80),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Text(
          '“The cosmos is calling. We\'re building the tools to answer.”',
          style: TextStyles.headlineSmall.copyWith(
            fontStyle: FontStyle.italic,
            color: Colors.white.withOpacity(0.8),
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}