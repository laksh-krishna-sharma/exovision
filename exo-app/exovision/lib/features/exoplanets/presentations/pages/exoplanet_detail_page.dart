import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';

import '../../../../shared/widgets/common/space_background.dart';
import '../../../../shared/widgets/common/navbar_fixed.dart';

class ExoplanetDetailPage extends StatefulWidget {
  final String exoplanetId;

  const ExoplanetDetailPage({super.key, required this.exoplanetId});

  @override
  State<ExoplanetDetailPage> createState() => _ExoplanetDetailPageState();
}

class _ExoplanetDetailPageState extends State<ExoplanetDetailPage> {
  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;

    return Scaffold(
      body: Stack(
        children: [
          const SpaceBackground(), // Remove const if SpaceBackground is not const
          Column(
            children: [
              NavbarFixed(
                title: 'Exoplanet Details',
                showBackButton: true,
                onBackTap: () => context.go('/exoplanets'),
              ),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.all(isMobile ? 16 : 24),
                  child: Center(
                    child: Text(
                      'Exoplanet Detail: ${widget.exoplanetId}',
                      style: isMobile ? TextStyles.headlineSmall : TextStyles.headlineMedium,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}