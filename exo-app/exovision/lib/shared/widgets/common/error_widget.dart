import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';

class ErrorDisplayWidget extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback? onRetry;
  final bool isMobile;

  const ErrorDisplayWidget({
    super.key,
    required this.title,
    required this.message,
    this.onRetry,
    required this.isMobile,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(isMobile ? 20 : 24),
      decoration: BoxDecoration(
        color: AppColors.surface.withOpacity(0.8),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.red.withOpacity(0.3)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.error_outline,
            color: Colors.red,
            size: isMobile ? 40 : 48,
          ),
          SizedBox(height: isMobile ? 12 : 16),
          Text(
            title,
            style: (isMobile ? TextStyles.titleMedium : TextStyles.titleLarge)
                .copyWith(color: Colors.red),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: isMobile ? 8 : 12),
          Text(
            message,
            style: (isMobile ? TextStyles.bodyMedium : TextStyles.bodyLarge)
                .copyWith(color: Colors.white70),
            textAlign: TextAlign.center,
          ),
          if (onRetry != null) ...[
            SizedBox(height: isMobile ? 16 : 20),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.cyan,
                foregroundColor: Colors.black,
                padding: EdgeInsets.symmetric(
                  horizontal: isMobile ? 24 : 32,
                  vertical: isMobile ? 12 : 16,
                ),
              ),
              child: Text(
                'Try Again',
                style: TextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ],
      ),
    ).animate().fadeIn().slideY(begin: 0.2);
  }
}