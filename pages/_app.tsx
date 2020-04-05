import './styles/index.scss'

type Props = {
  Component: any
  pageProps: any
}
export default ({ Component, pageProps }: Props) => {
  return <Component {...pageProps} />
}
