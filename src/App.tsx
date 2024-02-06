import DomToImage from 'dom-to-image'
// import html2canvas from 'html2canvas'
import { useRef, useState } from 'react'
import styles from "./App.module.css"

const Result = ({ text }: { text: string }) => {
    const tableRef = useRef<HTMLTableElement>(null)
    const [copied, setCopied] = useState(false)

    const list = text.trim().split("\n")
    const title = list.shift()
    const head = list.shift()

    if (title === undefined || head === undefined) return (
        <p className={styles.error}>
            処理に失敗しました。
        </p>
    )

    return (
        <div className={styles.Result}>
            <h2>{title}</h2>
            <table ref={tableRef} className={styles.Table}>
                <thead>
                    <tr>
                        {head.split(/[\t\s]+/).map((item, index) => (
                            <th key={index}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list.map((line, index) => (
                        <tr key={index}>
                            {line.split(/[\t\s]+/).map((item, index) => (
                                <td key={index}>{item}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button role="button" onClick={async () => {
                if (tableRef.current === null) return

                const blob = await DomToImage.toBlob(tableRef.current)
                const item = new ClipboardItem({ "image/png": blob })
                await navigator.clipboard.write([item])
                setCopied(true)
                window.setInterval(() => setCopied(false), 3000)

                // // HTML2Canvas
                // const result = await html2canvas(tableRef.current)
                // result.toBlob(async (blob) => {
                //     if (blob === null) throw new Error("Failed to get image data.")
                //     const item = new ClipboardItem({ "image/png": blob })
                //     await navigator.clipboard.write([item])
                //     setCopied(true)
                //     window.setInterval(() => setCopied(false), 3000)
                // }, "image/png")
            }}>
                {copied ? "コピーしました！" : "画像としてコピー"}
            </button>
        </div >
    )
}

export const App = () => {
    const ref = useRef<HTMLTextAreaElement>(null)
    const [input, setInput] = useState<string>()

    return (
        <div className={styles.App}>
            <h1>じゃんたまの試合の結果を整形するツール</h1>
            <p>
                あの見づらい表をいい感じにフォーマット！<br />
                ついでに画像にする！
            </p>
            <textarea
                ref={ref}
                className={styles.Input}
                onInput={() => setInput(ref.current?.value.trim())}
            />
            {
                input?.split("\n\n").map((datum, index) => <Result key={index} text={datum} />)
            }
        </div>
    )
}
