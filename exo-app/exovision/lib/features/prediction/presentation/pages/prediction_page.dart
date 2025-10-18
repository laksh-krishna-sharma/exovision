import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:provider/provider.dart';

import '../../../../app/redux/app_state.dart';
import '../../../../shared/widgets/layout/app_scaffold.dart';
import '../../../../shared/widgets/common/loading_indicator.dart';
import '../../../../shared/widgets/common/error_widget.dart';
import '../providers/prediction_provider.dart';
import '../widgets/parameters_card.dart';
import '../widgets/predictions_table.dart';
import '../widgets/model_select_button.dart';

class PredictionPage extends StatefulWidget {
  const PredictionPage({super.key});

  @override
  State<PredictionPage> createState() => _PredictionPageState();
}

class _PredictionPageState extends State<PredictionPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PredictionProvider>().loadPredictions();
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'AI Prediction',
      body: StoreConnector<AppState, bool>(
        converter: (store) => store.state.uiState.isLoading,
        builder: (context, isLoading) {
          if (isLoading) {
            return const Center(child: LoadingIndicator());
          }

          return Consumer<PredictionProvider>(
            builder: (context, provider, child) {
              if (provider.error != null) {
                return Center(
                  child: ErrorDisplayWidget(
                    title: 'Error',
                    message: provider.error!,
                    onRetry: () => provider.loadPredictions(),
                    isMobile: true,
                  ),
                );
              }

              return SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header Section
                    Text(
                      'Exoplanet Detection AI',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Use our advanced machine learning models to predict exoplanet presence from stellar data.',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Model Selection
                    const ModelSelectButton(),
                    const SizedBox(height: 24),

                    // Parameters Input Card
                    const ParametersCard(),
                    const SizedBox(height: 24),

                    // Predictions History
                    Text(
                      'Prediction History',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const PredictionsTable(),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}