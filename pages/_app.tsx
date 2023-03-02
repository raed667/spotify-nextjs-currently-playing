import './styles/index.scss'

type Props = {
  Component: React.ElementType
  pageProps: any
}
const App = ({ Component, pageProps }: Props) => {
  return <Component {...pageProps} />
}

export default App
