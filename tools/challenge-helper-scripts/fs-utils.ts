import { SuperBlocks } from '../../config/certification-settings';

export function getSuperBlockSubPath(superBlock: SuperBlocks): string {
  const pathMap = {
    [SuperBlocks.RespWebDesign]: '01-responsive-web-design',
    [SuperBlocks.JsAlgoDataStruct]:
      '02-javascript-algorithms-and-data-structures',
    [SuperBlocks.FrontEndDevLibs]: '03-front-end-development-libraries',
    [SuperBlocks.DataVis]: '04-data-visualization',
    [SuperBlocks.BackEndDevApis]: '05-back-end-development-and-apis',
    [SuperBlocks.QualityAssurance]: '06-quality-assurance',
    [SuperBlocks.SciCompPy]: '07-scientific-computing-with-python',
    [SuperBlocks.DataAnalysisPy]: '08-data-analysis-with-python',
    [SuperBlocks.InfoSec]: '09-information-security',
    [SuperBlocks.CodingInterviewPrep]: '10-coding-interview-prep',
    [SuperBlocks.MachineLearningPy]: '11-machine-learning-with-python',
    [SuperBlocks.RelationalDb]: '13-relational-databases',
    [SuperBlocks.RespWebDesignNew]: '14-responsive-web-design-22',
    [SuperBlocks.RespWebDesignQA]: '14-responsive-web-design-22-qa',
    [SuperBlocks.JsAlgoDataStructNew]:
      '15-javascript-algorithms-and-data-structures-22'
  };
  return pathMap[superBlock];
}
