import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';

import '../../../../shared/widgets/common/space_background.dart';
import '../../../../shared/widgets/common/navbar_fixed.dart';

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<FavoritesPage> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> {
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
                title: 'Favorites',
                showBackButton: true,
                onBackTap: () => context.go('/exoplanets'),
              ),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.all(isMobile ? 16 : 24),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.favorite_border,
                          size: isMobile ? 60 : 80,
                          color: Colors.white.withOpacity(0.3),
                        ),
                        SizedBox(height: isMobile ? 16 : 24),
                        Text(
                          'No favorites yet',
                          style: isMobile ? TextStyles.titleMedium : TextStyles.titleLarge,
                        ),
                        SizedBox(height: isMobile ? 8 : 12),
                        Text(
                          'Start adding exoplanets to your favorites!',
                          style: isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge,
                          textAlign: TextAlign.center,
                        ),
                      ],
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