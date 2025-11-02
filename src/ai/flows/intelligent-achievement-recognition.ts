'use server';

/**
 * @fileOverview Analyzes the game results and displays a relevant image or achievement based on performance.
 *
 * - `analyzeGameResult` - A function that analyzes the game results and returns the appropriate image ID.
 * - `AnalyzeGameResultInput` - The input type for the analyzeGameResult function.
 * - `AnalyzeGameResultOutput` - The return type for the analyzeGameResult function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGameResultInputSchema = z.object({
  cps: z.number().describe('Clicks per second achieved by the player.'),
  totalClicks: z.number().describe('Total number of clicks achieved by the player.'),
  timeUsed: z.number().describe('Time used by the player to complete the game in seconds.'),
  targetMet: z.boolean().describe('Whether the player met the target or not.'),
  selectedTime: z.number().describe('The selected time for the game.'),
  target: z.number().describe('The target number of clicks for the selected time.'),
});
export type AnalyzeGameResultInput = z.infer<typeof AnalyzeGameResultInputSchema>;

const AnalyzeGameResultOutputSchema = z.object({
  imageId: z.string().describe('The ID of the image to display based on the game result.'),
});
export type AnalyzeGameResultOutput = z.infer<typeof AnalyzeGameResultOutputSchema>;

export async function analyzeGameResult(input: AnalyzeGameResultInput): Promise<AnalyzeGameResultOutput> {
  return analyzeGameResultFlow(input);
}

const analyzeGameResultPrompt = ai.definePrompt({
  name: 'analyzeGameResultPrompt',
  input: {schema: AnalyzeGameResultInputSchema},
  output: {schema: AnalyzeGameResultOutputSchema},
  prompt: `You are an AI game analyst. Your task is to analyze the results of a click speed game and determine the most appropriate image ID to display to the user based on their performance.

Here's the game result data:
- Clicks per second (CPS): {{cps}}
- Total clicks: {{totalClicks}}
- Time used: {{timeUsed}}
- Target met: {{targetMet}}
- Selected time: {{selectedTime}}
- Target clicks: {{target}}

Consider these factors to determine the image ID:
- If the player met the target, especially if the selected time is 100 seconds, suggest 'resultWorldCupImage' to congratulate them.
- If the player met the target, suggest 'resultSuccessImage' to celebrate their success.
- If the player did not meet the target, suggest 'resultFailImage' to acknowledge their effort.

Based on the analysis, return the image ID that best represents the outcome of the game.

Return ONLY the image ID. For example:
resultSuccessImage`,
});

const analyzeGameResultFlow = ai.defineFlow(
  {
    name: 'analyzeGameResultFlow',
    inputSchema: AnalyzeGameResultInputSchema,
    outputSchema: AnalyzeGameResultOutputSchema,
  },
  async input => {
    const {output} = await analyzeGameResultPrompt(input);
    return {imageId: output!.imageId};
  }
);
