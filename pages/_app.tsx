import './styles/index.scss'

type Props = {
  Component: React.ElementType
  pageProps: any
}
export default ({ Component, pageProps }: Props) => {
  return <Component {...pageProps} />
}
