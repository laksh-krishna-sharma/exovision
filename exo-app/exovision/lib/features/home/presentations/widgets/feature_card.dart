import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/text_styles.dart';

class FeatureCard extends StatelessWidget {
  final String icon;
  final String title;
  final String description;
  final int index;
  final bool isMobile;

  const FeatureCard({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    required this.index,
    required this.isMobile,
  });

  @override
  Widget build(BuildContext context) {
    final delays = [300, 500, 700];
    
    return Container(
      padding: EdgeInsets.all(isMobile ? 20 : 32),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            icon,
            style: TextStyle(fontSize: isMobile ? 32 : 40),
          ),
          SizedBox(height: isMobile ? 12 : 16),
          Text(
            title,
            style: isMobile
                ? TextStyles.titleMedium.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  )
                : TextStyles.headlineSmall.copyWith(
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: isMobile ? 8 : 16),
          Text(
            description,
            style: isMobile
                ? TextStyles.bodySmall.copyWith(
                    color: Colors.white.withOpacity(0.8),
                    height: 1.5,
                  )
                : TextStyles.bodyMedium.copyWith(
                    color: Colors.white.withOpacity(0.8),
                    height: 1.5,
                  ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    ).animate(delay: delays[index].ms).slideX(
      begin: index == 0 ? -0.3 : (index == 2 ? 0.3 : 0.0),
    ).fadeIn();
  }
}