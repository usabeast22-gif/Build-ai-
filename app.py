import streamlit as st
import zipfile
import io

st.set_page_config(
    page_title="BuildAI Free",
    page_icon="🤖",
    layout="wide"
)

st.title("🤖 BuildAI Free")
st.write("Free AI Website & App Builder")

prompt = st.text_area(
    "What do you want to build?",
    placeholder="Example: Create a modern thrift store website..."
)

if st.button("🚀 Generate"):
    if not prompt.strip():
        st.warning("Please enter a prompt first.")
    else:
        st.success("Project generated!")

        html_code = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BuildAI Project</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
        }}
        .container {{
            max-width: 900px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 16px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>My AI Generated Website</h1>
        <p>{prompt}</p>
    </div>
</body>
</html>
"""

        st.subheader("📄 Generated Code")

        st.code(html_code, language="html")

        st.subheader("👀 Preview")

        st.components.v1.html(
            html_code,
            height=500,
            scrolling=True
        )

        zip_buffer = io.BytesIO()

        with zipfile.ZipFile(
            zip_buffer,
            "w",
            zipfile.ZIP_DEFLATED
        ) as zip_file:
            zip_file.writestr("index.html", html_code)

        st.download_button(
            "📦 Download Project ZIP",
            data=zip_buffer.getvalue(),
            file_name="BuildAI-project.zip",
            mime="application/zip"
        )

st.divider()

st.caption("BuildAI Free • Starter version")
