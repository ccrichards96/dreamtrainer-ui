export interface Module {
  title: string;
  description: string;
  videoUrl: string;
  botIframeUrl: string;
}

export interface DreamFlowProps {
  modules: Module[];
  onComplete?: () => void;
}
