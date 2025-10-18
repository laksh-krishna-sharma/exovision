import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../shared/widgets/common/space_background.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;

    return Scaffold(
      body: Stack(
        children: [
          const SpaceBackground(),
          SafeArea(
            child: Padding(
              padding: EdgeInsets.all(isMobile ? 16 : 24),
              child: Column(
                children: [
                  // Simple header for now
                  Row(
                    children: [
                      IconButton(
                        onPressed: () => context.go('/home'),
                        icon: const Icon(Icons.arrow_back, color: Colors.white),
                      ),
                      SizedBox(width: isMobile ? 12 : 16),
                      Text(
                        'Profile',
                        style: isMobile ? TextStyles.headlineSmall : TextStyles.headlineMedium,
                      ),
                    ],
                  ),
                  SizedBox(height: isMobile ? 40 : 60),
                  Center(
                    child: Text(
                      'Profile Page - Coming Soon',
                      style: isMobile ? TextStyles.titleMedium : TextStyles.titleLarge,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}