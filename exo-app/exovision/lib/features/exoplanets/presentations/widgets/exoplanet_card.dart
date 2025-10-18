import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';

class ExoplanetCard extends StatelessWidget {
  final Map<String, dynamic> exoplanet;
  final VoidCallback onTap;
  final VoidCallback onFavoriteToggle;
  final bool isFavorite;
  final bool isMobile;

  const ExoplanetCard({
    super.key,
    required this.exoplanet,
    required this.onTap,
    required this.onFavoriteToggle,
    required this.isFavorite,
    required this.isMobile,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: EdgeInsets.all(isMobile ? 8 : 12),
        padding: EdgeInsets.all(isMobile ? 16 : 20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    exoplanet['name'] ?? 'Unknown Planet',
                    style: (isMobile ? TextStyles.titleMedium : TextStyles.titleLarge)
                        .copyWith(
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                SizedBox(width: isMobile ? 8 : 12),
                GestureDetector(
                  onTap: onFavoriteToggle,
                  child: Container(
                    padding: EdgeInsets.all(isMobile ? 6 : 8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: isFavorite ? Colors.red : Colors.white.withOpacity(0.6),
                      size: isMobile ? 16 : 18,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: isMobile ? 12 : 16),
            
            // Planet representation
            Center(
              child: Container(
                width: isMobile ? 60 : 80,
                height: isMobile ? 60 : 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: _getPlanetGradient(),
                ),
              ),
            ),
            SizedBox(height: isMobile ? 12 : 16),
            
            // Basic info
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildDetailItem(
                  label: 'Radius',
                  value: exoplanet['planetRadius'] != null 
                      ? '${exoplanet['planetRadius']} R⊕'
                      : 'Unknown',
                ),
                _buildDetailItem(
                  label: 'Mass',
                  value: exoplanet['planetMass'] != null
                      ? '${exoplanet['planetMass']} M⊕'
                      : 'Unknown',
                ),
                _buildDetailItem(
                  label: 'Temp',
                  value: exoplanet['equilibriumTemperature'] != null
                      ? '${exoplanet['equilibriumTemperature']}K'
                      : 'Unknown',
                ),
              ],
            ),
            SizedBox(height: isMobile ? 12 : 16),
            
            // Discovery info
            Container(
              padding: EdgeInsets.all(isMobile ? 12 : 16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Discovered ${exoplanet['discoveryYear'] ?? 'Unknown'}',
                        style: (isMobile ? TextStyles.labelSmall : TextStyles.labelMedium)
                            .copyWith(
                          color: Colors.white.withOpacity(0.8),
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        exoplanet['discoveryMethod'] ?? 'Unknown',
                        style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
                            .copyWith(
                          color: AppColors.cyan,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  if (exoplanet['isHabitable'] == true)
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: isMobile ? 8 : 12,
                        vertical: isMobile ? 4 : 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: Colors.green.withOpacity(0.5)),
                      ),
                      child: Text(
                        'Habitable',
                        style: (isMobile ? TextStyles.labelSmall : TextStyles.labelMedium)
                            .copyWith(
                          color: Colors.green,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn().scale();
  }

  Widget _buildDetailItem({
    required String label,
    required String value,
  }) {
    return Column(
      children: [
        Text(
          value,
          style: (isMobile ? TextStyles.bodySmall : TextStyles.bodyMedium)
              .copyWith(
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 4),
        Text(
          label,
          style: (isMobile ? TextStyles.labelSmall : TextStyles.labelMedium)
              .copyWith(
            color: Colors.white.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  LinearGradient _getPlanetGradient() {
    if (exoplanet['isHabitable'] == true) {
      return LinearGradient(
        colors: [Colors.blue.shade300, Colors.green.shade400],
      );
    } else if (exoplanet['planetRadius'] != null && exoplanet['planetRadius'] > 4.0) {
      return LinearGradient(
        colors: [Colors.orange.shade300, Colors.red.shade400],
      );
    } else {
      return LinearGradient(
        colors: [Colors.brown.shade300, Colors.orange.shade400],
      );
    }
  }
}