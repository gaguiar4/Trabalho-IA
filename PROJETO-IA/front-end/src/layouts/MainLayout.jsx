function MainLayout({ sidebar, content }) {
  return (
    <div className="main-layout">
      {sidebar}
      {content}
    </div>
  )
}

export default MainLayout
