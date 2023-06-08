import Image from 'next/image';

export default function Compras() {
  return (
    <div>
      <Image
        loading="lazy" // Mejora la carga inicial de la imagen
        width={300}
        height={400}
        src="https://lh3.googleusercontent.com/pw/AJFCJaVqOynLyBjH0Uc3A1kekS_uc9mCZ858JNF9STVMQgds1KtnHiQVT664tRj8V0iKX8CF1Q4LovOTH2-UjPR5qWUEVeQQkmINAxIFQ2AEuKFRP5LkrAb5B43OcHsDQDBDUK1gvmXI0swDGqeD4l7wlP5L=w645-h859-s-no?authuser=0"
        alt="Profile Picture"
        
      />
    </div>
  );
}
