import InclusionsCard from "./InclusionsCard";
export default function InclusionsSection({ includedServices = [] }) {
  return (
    <div className="flex justify-center p-6">
      <InclusionsCard inclusions={includedServices} />
    </div>
  );
}

