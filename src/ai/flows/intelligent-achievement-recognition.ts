
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

Here are the available image IDs:
- resultWorldCupImage: For exceptional performance, especially in the 100s challenge.
- resultSuccessImage: For meeting the target in any challenge.
- resultFailImage5s: For failing the 5-second challenge.
- resultFailImage10s: For failing the 10-second challenge.
- resultFailImage15s: For failing the 15-second challenge.
- resultFailImage30s: For failing the 30-second challenge.
- resultFailImage60s: For failing the 60-second challenge.
- resultFailImage100s: For failing the 100-second challenge.

Analyze the data and choose the SINGLE most appropriate image ID.

- If 'targetMet' is true and 'selectedTime' is 100, the best imageId is 'resultWorldCupImage'.
- If 'targetMet' is true for any other time, the best imageId is 'resultSuccessImage'.
- If 'targetMet' is false, select the correct fail image based on 'selectedTime'. For example, if 'selectedTime' is 15, the imageId should be 'resultFailImage15s'.

Return ONLY the chosen image ID. For example:
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

    