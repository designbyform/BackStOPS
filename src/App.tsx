import { useBrandStore } from './store/brandStore'
import { Landing } from './pages/Landing'
import { NewScan } from './pages/NewScan'
import { UploadAssets } from './pages/UploadAssets'
import { Processing } from './pages/Processing'
import { BrandBrain } from './pages/BrandBrain'
import { Diagnosis } from './pages/Diagnosis'
import { PromptLibrary } from './pages/PromptLibrary'
import { Exports } from './pages/Exports'

export function App() {
  const currentStep = useBrandStore((s) => s.currentStep)

  switch (currentStep) {
    case 'landing':
      return <Landing />
    case 'new-scan':
      return <NewScan />
    case 'upload-assets':
      return <UploadAssets />
    case 'processing':
      return <Processing />
    case 'brand-brain':
      return <BrandBrain />
    case 'diagnosis':
      return <Diagnosis />
    case 'prompt-library':
      return <PromptLibrary />
    case 'exports':
      return <Exports />
    default:
      return <Landing />
  }
}
